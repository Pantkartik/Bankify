package slbank.web.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import slbank.web.app.entity.Card;

import java.util.Optional;
import java.util.UUID;

public interface CardRepository extends JpaRepository<Card, String> {

    Optional<Card> findByOwnerUid(UUID uid);

    boolean existsByCardNumber(double cardNumber);
}
