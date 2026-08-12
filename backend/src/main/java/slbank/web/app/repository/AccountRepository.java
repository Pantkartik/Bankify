package slbank.web.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import slbank.web.app.entity.Account;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    List<Account> findAllByOwnerUid(UUID uid);
    boolean existsByAccountNumber(long accountNumber);
    boolean existsByCodeAndOwnerUid(String code, UUID uid);

    Optional<Account> findByCodeAndOwnerUid(String code, UUID uid);

    Optional<Account> findByAccountNumber(long recipientAccountNumber);
}