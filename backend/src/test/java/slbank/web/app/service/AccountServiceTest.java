package slbank.web.app.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import slbank.web.app.dto.AccountDto;
import slbank.web.app.dto.ConvertDto;
import slbank.web.app.dto.TransferDto;
import slbank.web.app.entity.Account;
import slbank.web.app.entity.Status;
import slbank.web.app.entity.Transactions;
import slbank.web.app.entity.Type;
import slbank.web.app.entity.User;
import slbank.web.app.repository.AccountRepository;
import slbank.web.app.service.helper.AccountHelper;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AccountService Unit Tests - Core Banking & Transfers")
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AccountHelper accountHelper;

    @Mock
    private ExhangeRateService exhangeRateService;

    @InjectMocks
    private AccountService accountService;

    private User testUser;
    private Account senderAccount;
    private Account receiverAccount;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .uid(UUID.randomUUID())
                .firstname("Master")
                .lastname("Card")
                .username("mastercard@test.com")
                .build();

        senderAccount = Account.builder()
                .accountId("acc-sender")
                .accountNumber(1001L)
                .code("USD")
                .balance(1000.0)
                .owner(testUser)
                .build();

        receiverAccount = Account.builder()
                .accountId("acc-receiver")
                .accountNumber(1002L)
                .code("USD")
                .balance(200.0)
                .build();
    }

    @Test
    @DisplayName("Should create new bank account via AccountHelper")
    void createAccount_Success() throws Exception {
        AccountDto dto = new AccountDto();
        dto.setCode("EUR");
        dto.setSymbol("€");

        Account created = Account.builder()
                .code("EUR")
                .balance(1000.0)
                .build();

        when(accountHelper.createAccount(dto, testUser)).thenReturn(created);

        Account result = accountService.createAccount(dto, testUser);

        assertNotNull(result);
        assertEquals("EUR", result.getCode());
        verify(accountHelper, times(1)).createAccount(dto, testUser);
    }

    @Test
    @DisplayName("Should execute inter-account fund transfer successfully")
    void transferFunds_Success() throws Exception {
        TransferDto transferDto = new TransferDto();
        transferDto.setCode("USD");
        transferDto.setRecipientAccountNumber(1002L);
        transferDto.setAmount(300.0);

        when(accountRepository.findByCodeAndOwnerUid("USD", testUser.getUid()))
                .thenReturn(Optional.of(senderAccount));
        when(accountRepository.findByAccountNumber(1002L))
                .thenReturn(Optional.of(receiverAccount));

        Transactions completedTx = Transactions.builder()
                .amount(300.0)
                .type(Type.WITHDRAWAL)
                .status(Status.COMPLETED)
                .build();

        when(accountHelper.performTransfer(senderAccount, receiverAccount, 300.0, testUser))
                .thenReturn(completedTx);

        Transactions result = accountService.transferFunds(transferDto, testUser);

        assertNotNull(result);
        assertEquals(300.0, result.getAmount());
        assertEquals(Status.COMPLETED, result.getStatus());
        verify(accountHelper).performTransfer(senderAccount, receiverAccount, 300.0, testUser);
    }

    @Test
    @DisplayName("Should throw exception if sender account does not exist")
    void transferFunds_SenderAccountNotFound_ThrowsException() {
        TransferDto transferDto = new TransferDto();
        transferDto.setCode("GBP");
        transferDto.setRecipientAccountNumber(1002L);
        transferDto.setAmount(100.0);

        when(accountRepository.findByCodeAndOwnerUid("GBP", testUser.getUid()))
                .thenReturn(Optional.empty());

        assertThrows(UnsupportedOperationException.class, () ->
                accountService.transferFunds(transferDto, testUser));
    }

    @Test
    @DisplayName("Should return foreign exchange rates")
    void getExchangeRates_Success() {
        Map<String, Double> rates = Map.of("USD", 1.0, "EUR", 0.92, "INR", 83.2);
        when(exhangeRateService.getRates()).thenReturn(rates);

        Map<String, Double> result = accountService.getExchangeRates();

        assertEquals(3, result.size());
        assertEquals(83.2, result.get("INR"));
        verify(exhangeRateService).getRates();
    }
}
