package slbank.web.app.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import slbank.web.app.entity.*;
import slbank.web.app.repository.CardRepository;
import slbank.web.app.service.helper.AccountHelper;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CardService Unit Tests - Core Payment Operations")
class CardServiceTest {

    @Mock
    private CardRepository cardRepository;

    @Mock
    private AccountHelper accountHelper;

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private CardService cardService;

    private User testUser;
    private Account testUsdAccount;
    private Card testCard;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .uid(UUID.randomUUID())
                .firstname("John")
                .lastname("Doe")
                .username("john.doe@example.com")
                .build();

        testUsdAccount = Account.builder()
                .accountId("acc-usd-123")
                .accountNumber(1234567890L)
                .code("USD")
                .balance(500.0)
                .owner(testUser)
                .build();

        testCard = Card.builder()
                .cardId("card-123")
                .cardHolder("John Doe")
                .cardNumber(4111222233334444L)
                .balance(50.0)
                .exp(LocalDateTime.now().plusYears(3))
                .cvv("123")
                .owner(testUser)
                .build();

        testUser.setCard(testCard);
    }

    @Test
    @DisplayName("Should retrieve card for user successfully")
    void getCard_Success() {
        when(cardRepository.findByOwnerUid(testUser.getUid())).thenReturn(Optional.of(testCard));

        Card result = cardService.getCard(testUser);

        assertNotNull(result);
        assertEquals(testCard.getCardNumber(), result.getCardNumber());
        verify(cardRepository, times(1)).findByOwnerUid(testUser.getUid());
    }

    @Test
    @DisplayName("Should create card successfully when USD account has sufficient funds")
    void createCard_Success() throws Exception {
        double depositAmount = 50.0;
        when(accountHelper.existsByCodeAndOwnerUid("USD", testUser.getUid())).thenReturn(true);
        when(accountHelper.findByCodeAndOwnerUid("USD", testUser.getUid())).thenReturn(Optional.of(testUsdAccount));
        when(cardRepository.existsByCardNumber(anyLong())).thenReturn(false);
        when(cardRepository.save(any(Card.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Card createdCard = cardService.createCard(depositAmount, testUser);

        assertNotNull(createdCard);
        assertEquals(depositAmount - 1, createdCard.getBalance());
        assertEquals("John Doe", createdCard.getCardHolder());

        // Verify transactions created: 1 for card fee, 1 for account deduction, 1 for card credit
        verify(transactionService, times(2)).createAccountTransaction(anyDouble(), eq(Type.WITHDRAWAL), eq(0.0), eq(testUser), eq(testUsdAccount));
        verify(transactionService, times(1)).createCardTransaction(eq(depositAmount - 1), eq(Type.WITHDRAWAL), eq(0.0), eq(testUser), any(Card.class));
        verify(accountHelper, times(1)).save(testUsdAccount);
    }

    @Test
    @DisplayName("Should throw exception when creating card with less than minimum amount")
    void createCard_AmountLessThanMinimum_ThrowsException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                cardService.createCard(1.5, testUser));

        assertTrue(exception.getMessage().contains("Amount should be at least $2"));
        verifyNoInteractions(cardRepository);
    }

    @Test
    @DisplayName("Should throw exception when user has no USD account")
    void createCard_NoUsdAccount_ThrowsException() {
        when(accountHelper.existsByCodeAndOwnerUid("USD", testUser.getUid())).thenReturn(false);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                cardService.createCard(10.0, testUser));

        assertTrue(exception.getMessage().contains("USD Account not found"));
    }

    @Test
    @DisplayName("Should credit card balance successfully")
    void creditCard_Success() {
        double creditAmount = 25.0;
        when(accountHelper.findByCodeAndOwnerUid("USD", testUser.getUid())).thenReturn(Optional.of(testUsdAccount));
        when(cardRepository.save(any(Card.class))).thenReturn(testCard);

        Transactions expectedTx = Transactions.builder()
                .amount(creditAmount)
                .type(Type.CREDIT)
                .status(Status.COMPLETED)
                .card(testCard)
                .build();
        when(transactionService.createCardTransaction(creditAmount, Type.CREDIT, 0.0, testUser, testCard))
                .thenReturn(expectedTx);

        Transactions tx = cardService.creditCard(creditAmount, testUser);

        assertNotNull(tx);
        assertEquals(Type.CREDIT, tx.getType());
        assertEquals(creditAmount, tx.getAmount());
        verify(cardRepository, times(1)).save(testCard);
    }

    @Test
    @DisplayName("Should debit card balance successfully")
    void debitCard_Success() {
        double debitAmount = 20.0;
        when(accountHelper.findByCodeAndOwnerUid("USD", testUser.getUid())).thenReturn(Optional.of(testUsdAccount));
        when(cardRepository.save(any(Card.class))).thenReturn(testCard);

        Transactions expectedTx = Transactions.builder()
                .amount(debitAmount)
                .type(Type.DEBIT)
                .status(Status.COMPLETED)
                .card(testCard)
                .build();
        when(transactionService.createCardTransaction(debitAmount, Type.DEBIT, 0.0, testUser, testCard))
                .thenReturn(expectedTx);

        Transactions tx = cardService.debitCard(debitAmount, testUser);

        assertNotNull(tx);
        assertEquals(Type.DEBIT, tx.getType());
        assertEquals(debitAmount, tx.getAmount());
        verify(cardRepository, times(1)).save(testCard);
    }
}
