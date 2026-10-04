package slbank.web.app.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import slbank.web.app.entity.Transactions;

import java.time.Instant;

/**
 * Domain event published whenever a new financial transaction (Card or Account) is executed.
 * Aligned with event-driven architecture and asynchronous message broadcasting.
 */
@Getter
public class TransactionCreatedEvent extends ApplicationEvent {

    private final Transactions transaction;
    private final Instant timestamp;

    public TransactionCreatedEvent(Object source, Transactions transaction) {
        super(source);
        this.transaction = transaction;
        this.timestamp = Instant.now();
    }
}
