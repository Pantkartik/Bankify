package slbank.web.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import slbank.web.app.dto.AccountDto;
import slbank.web.app.dto.ConvertDto;
import slbank.web.app.dto.TransferDto;
import slbank.web.app.entity.Account;
import slbank.web.app.entity.Transactions;
import slbank.web.app.entity.User;
import slbank.web.app.repository.AccountRepository;
import slbank.web.app.service.helper.AccountHelper;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountHelper accountHelper;
    private final ExhangeRateService exhangeRateService;

    public Account createAccount(AccountDto accountDto, User user) throws Exception {
        return accountHelper.createAccount(accountDto, user);
    }

    public List<Account> getUserAccounts(UUID uid) {
        return accountRepository.findAllByOwnerUid(uid);
    }

    public Transactions transferFunds(TransferDto transferDto, User user) throws Exception {
        var senderAccount = accountRepository.findByCodeAndOwnerUid(transferDto.getCode(), user.getUid())
                .orElseThrow(() -> new UnsupportedOperationException("Account of type currency do not exists for user"));
        var receiverAccount = accountRepository.findByAccountNumber(transferDto.getRecipientAccountNumber()).orElseThrow();
        return accountHelper.performTransfer(senderAccount, receiverAccount, transferDto.getAmount(), user);
    }

    public Map<String, Double> getExchangeRates(){
        return exhangeRateService.getRates();
    }

    public Transactions convertCurrency(ConvertDto convertDto, User user) throws Exception {
        return accountHelper.convertCurrency(convertDto, user);
    }
}