package slbank.web.app.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import slbank.web.app.entity.*;
import slbank.web.app.event.TransactionCreatedEvent;
import slbank.web.app.repository.TransactionRepository;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TransactionService Unit Tests - Ledger & Event Dispatching")
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private TransactionService transactionService;

    private User testUser;
    private Account testAccount;
    private Card testCard;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .uid(UUID.randomUUID())
                .firstname("Alice")
                .lastname("Smith")
                .username("alice@example.com")
                .build();

        testAccount = Account.builder()
                .accountId("acc-1")
                .accountNumber(9876543210L)
                .code("USD")
                .balance(1000.0)
                .owner(testUser)
                .build();

        testCard = Card.builder()
                .cardId("card-1")
                .cardHolder("Alice Smith")
                .cardNumber(5555444433332222L)
                .balance(200.0)
                .owner(testUser)
                .build();
    }

    @Test
    @DisplayName("Should retrieve paginated transactions for user")
    void getAllTransactions_ReturnsPagedContent() {
        Transactions tx = Transactions.builder()
                .txId("tx-1")
                .amount(100.0)
                .type(Type.DEPOSIT)
                .status(Status.COMPLETED)
                .owner(testUser)
                .build();

        Page<Transactions> pageResult = new PageImpl<>(List.of(tx));
        when(transactionRepository.findAllByOwnerUid(eq(testUser.getUid()), any(Pageable.class)))
                .thenReturn(pageResult);

        List<Transactions> result = transactionService.getAllTransactions("0", testUser);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("tx-1", result.get(0).getTxId());
        verify(transactionRepository).findAllByOwnerUid(eq(testUser.getUid()), any(Pageable.class));
    }

    @Test
    @DisplayName("Should save account transaction and publish domain event")
    void createAccountTransaction_PublishesEventAndSaves() {
        when(transactionRepository.save(any(Transactions.class))).thenAnswer(invocation -> {
            Transactions arg = invocation.getArgument(0);
            arg.setTxId("tx-acc-saved");
            return arg;
        });

        Transactions result = transactionService.createAccountTransaction(150.0, Type.DEPOSIT, 1.5, testUser, testAccount);

        assertNotNull(result);
        assertEquals(150.0, result.getAmount());
        assertEquals(Type.DEPOSIT, result.getType());
        assertEquals(Status.COMPLETED, result.getStatus());
        assertEquals(testAccount, result.getAccount());

        // Verify Event-Driven Publication
        ArgumentCaptor<TransactionCreatedEvent> eventCaptor = ArgumentCaptor.forClass(TransactionCreatedEvent.class);
        verify(eventPublisher, times(1)).publishEvent(eventCaptor.capture());
        TransactionCreatedEvent publishedEvent = eventCaptor.getValue();
        assertNotNull(publishedEvent);
        assertEquals("tx-acc-saved", publishedEvent.getTransaction().getTxId());
    }

    @Test
    @DisplayName("Should save card transaction and publish domain event")
    void createCardTransaction_PublishesEventAndSaves() {
        when(transactionRepository.save(any(Transactions.class))).thenAnswer(invocation -> {
            Transactions arg = invocation.getArgument(0);
            arg.setTxId("tx-card-saved");
            return arg;
        });

        Transactions result = transactionService.createCardTransaction(75.0, Type.DEBIT, 0.0, testUser, testCard);

        assertNotNull(result);
        assertEquals(75.0, result.getAmount());
        assertEquals(Type.DEBIT, result.getType());
        assertEquals(testCard, result.getCard());

        // Verify Event-Driven Publication
        ArgumentCaptor<TransactionCreatedEvent> eventCaptor = ArgumentCaptor.forClass(TransactionCreatedEvent.class);
        verify(eventPublisher, times(1)).publishEvent(eventCaptor.capture());
        assertEquals("tx-card-saved", eventCaptor.getValue().getTransaction().getTxId());
    }
}
