package slbank.web.app.repository;

import slbank.web.app.entity.Transactions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transactions, String> {

    Page<Transactions> findAllByOwnerUid(UUID uid, Pageable pageable);

    Page<Transactions> findAllByCardCardIdAndOwnerUid(String cardId, UUID uid, Pageable pageable);

    Page<Transactions> findAllByAccountAccountIdAndOwnerUid(String accountId, UUID uid, Pageable pageable);
}