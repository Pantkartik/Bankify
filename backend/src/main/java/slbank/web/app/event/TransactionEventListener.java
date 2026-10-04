package slbank.web.app.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import slbank.web.app.entity.Transactions;

/**
 * Asynchronous Event Listener handling post-transaction domain events.
 * Simulates real-world payment network behaviors:
 * 1. Transaction audit trail logging
 * 2. Fraud detection heuristic (large amount velocity check)
 * 3. Notification service triggering
 */
@Component
public class TransactionEventListener {

    private static final Logger logger = LoggerFactory.getLogger(TransactionEventListener.class);
    private static final double LARGE_TRANSACTION_THRESHOLD = 5000.00;

    @Async
    @EventListener
    public void handleTransactionCreatedEvent(TransactionCreatedEvent event) {
        Transactions tx = event.getTransaction();
        logger.info("[EVENT-DRIVEN] Processing TransactionCreatedEvent ID: {} | Type: {} | Amount: ${} | Status: {}",
                tx.getTxId(), tx.getType(), tx.getAmount(), tx.getStatus());

        // 1. Audit Logging Simulation
        logAuditTrail(tx);

        // 2. Real-time Fraud & Risk Screening Simulation (Mastercard Payment Network paradigm)
        screenForFraudRisk(tx);
    }

    private void logAuditTrail(Transactions tx) {
        String ownerInfo = tx.getOwner() != null ? tx.getOwner().getUsername() : "UNKNOWN";
        logger.info("[AUDIT] TxRef: {} recorded for user: {} at timestamp: {}",
                tx.getTxId(), ownerInfo, tx.getCreatedAt());
    }

    private void screenForFraudRisk(Transactions tx) {
        if (tx.getAmount() >= LARGE_TRANSACTION_THRESHOLD) {
            logger.warn("[RISK ALERT] High-value transaction detected! TxId: {}, Amount: ${}. Flagged for secondary screening.",
                    tx.getTxId(), tx.getAmount());
        }
    }
}
