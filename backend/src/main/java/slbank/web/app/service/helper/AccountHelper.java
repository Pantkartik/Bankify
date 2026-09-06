package slbank.web.app.service.helper;

import slbank.web.app.dto.AccountDto;
import slbank.web.app.dto.ConvertDto;
import slbank.web.app.entity.*;
import slbank.web.app.repository.AccountRepository;
import slbank.web.app.service.ExhangeRateService;
import slbank.web.app.service.TransactionService;
import slbank.web.app.util.RandomUtil;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.naming.OperationNotSupportedException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Getter
public class AccountHelper {

    private final AccountRepository accountRepository;
    private final TransactionService transactionService;
    private final ExhangeRateService exhangeRateService;
    private final Logger logger = LoggerFactory.getLogger(AccountHelper.class);

    private final Map<String, String> CURRENCIES = Map.of(
            "USD", "United States Dollar",
            "EUR", "Euro",
            "GBP", "British Pound",
            "JPY", "Japanese Yen",
            "NGN", "Nigerian Naira",
            "INR", "Indian Rupee"
    );


    public Account createAccount(AccountDto accountDto, User user) throws Exception {
        long accountNumber;
        try {
            validateAccountNonExistsForUser(accountDto.getCode(), user.getUid());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        do{
            accountNumber = new RandomUtil().generateRandom(10);
        } while(accountRepository.existsByAccountNumber(accountNumber));

        var account = Account.builder()
                .accountNumber(accountNumber)
                .accountName(user.getFirstname() + " " + user.getLastname())
                .balance(1000)
                .owner(user)
                .code(accountDto.getCode())
                .symbol(accountDto.getSymbol())
                .label(CURRENCIES.get(accountDto.getCode()))
                .build();
        return accountRepository.save(account);
    }

    public Transactions performTransfer(Account senderAccount, Account receiverAccount, double amount, User user) throws Exception {
        validateSufficientFunds(senderAccount, (amount * 1.01));
        senderAccount.setBalance(senderAccount.getBalance() - amount * 1.01);
        receiverAccount.setBalance(receiverAccount.getBalance() + amount);
        accountRepository.saveAll(List.of(senderAccount, receiverAccount));
        var senderTransaction = transactionService.createAccountTransaction(amount, Type.WITHDRAWAL, amount * 0.01, user, senderAccount);
        transactionService.createAccountTransaction(amount, Type.DEPOSIT, 0.00, receiverAccount.getOwner(), receiverAccount);

        return senderTransaction;
    }

    public void validateAccountNonExistsForUser(String code, UUID uid) throws Exception {
        if(accountRepository.existsByCodeAndOwnerUid(code, uid)) {
            throw new Exception("Account of this type already exist for this user");
        }
    }

    public void validateAccountOwner(Account account, User user) throws OperationNotSupportedException {
        if(!account.getOwner().getUid().equals(user.getUid())) {
            throw new OperationNotSupportedException("Invalid account owner");
        }
    }

    public void validateSufficientFunds(Account account, double amount) throws Exception {
        if(account.getBalance() < amount) {
            throw new OperationNotSupportedException("Insufficient funds in the account");
        }
    }

    public void validateAmount(double amount) throws Exception {
        if(amount <= 0) {
            throw new IllegalArgumentException("Invalid amount");
        }
    }

    public void validateDifferentCurrencyType(ConvertDto convertDto) throws Exception {
        if(convertDto.getToCurrency().equals(convertDto.getFromCurrency())){
            throw new IllegalArgumentException("Conversion between the same currency types is not allowed");
        }
    }

    public void validateAccountOwnership(ConvertDto convertDto, UUID uid) throws Exception {
        accountRepository.findByCodeAndOwnerUid(convertDto.getFromCurrency(), uid).orElseThrow();
        accountRepository.findByCodeAndOwnerUid(convertDto.getToCurrency(), uid).orElseThrow();
    }

    public void validateAccountOwnership(String code, UUID uid) throws Exception {
        accountRepository.findByCodeAndOwnerUid(code, uid).orElseThrow();
    }

    public void validateConversion(ConvertDto convertDto, UUID uid) throws Exception {
        validateDifferentCurrencyType(convertDto);
        validateAccountOwnership(convertDto, uid);
        validateAmount(convertDto.getAmount());
        validateSufficientFunds(accountRepository.findByCodeAndOwnerUid(convertDto.getFromCurrency(), uid).get(), convertDto.getAmount());
    }

    public Transactions convertCurrency(ConvertDto convertDto, User user) throws Exception {
        validateConversion(convertDto, user.getUid());
        var rates = exhangeRateService.getRates();
        var sendingRates = rates.get(convertDto.getFromCurrency());
        var receivingRates = rates.get(convertDto.getToCurrency());
        var computedAmount = (receivingRates/sendingRates) * convertDto.getAmount();
        Account fromAccount = accountRepository.findByCodeAndOwnerUid(convertDto.getFromCurrency(), user.getUid()).orElseThrow();
        Account toAccount = accountRepository.findByCodeAndOwnerUid(convertDto.getToCurrency(), user.getUid()).orElseThrow();
        fromAccount.setBalance(fromAccount.getBalance() - (convertDto.getAmount() * 1.01));
        toAccount.setBalance(toAccount.getBalance() + computedAmount);
        accountRepository.saveAll(List.of(fromAccount, toAccount));

        var fromAccountTransaction = transactionService.createAccountTransaction(convertDto.getAmount(), Type.CONVERSION, convertDto.getAmount() * 0.01, user, fromAccount);
        transactionService.createAccountTransaction(computedAmount, Type.DEPOSIT, convertDto.getAmount() * 0.00, user, toAccount);
        return fromAccountTransaction;
    }

    public boolean existsByCodeAndOwnerUid(String code, UUID uid) {
        return accountRepository.existsByCodeAndOwnerUid(code, uid);
    }

    public Optional<Account> findByCodeAndOwnerUid(String code, UUID uid) {
        return accountRepository.findByCodeAndOwnerUid(code, uid);
    }

    public Account save(Account usdAccount) {
        return accountRepository.save(usdAccount);
    }

}