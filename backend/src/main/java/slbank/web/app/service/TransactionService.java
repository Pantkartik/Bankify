package slbank.web.app.service;

import slbank.web.app.entity.*;
import slbank.web.app.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import slbank.web.app.event.TransactionCreatedEvent;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final ApplicationEventPublisher eventPublisher;

    public List<Transactions> getAllTransactions(String page, User user) {
        Pageable pageable = PageRequest.of(Integer.parseInt(page), 10, Sort.by("createdAt").ascending());
        return transactionRepository.findAllByOwnerUid(user.getUid(), pageable).getContent();
    }

    public List<Transactions> getTransactionsByCardId(String cardId, String page, User user) {
        Pageable pageable = PageRequest.of(Integer.parseInt(page), 10, Sort.by("createdAt").ascending());
        return transactionRepository.findAllByCardCardIdAndOwnerUid(cardId, user.getUid(), pageable).getContent();
    }

    public List<Transactions> getTransactionsByAccountId(String accountId, String page, User user) {
        Pageable pageable = PageRequest.of(Integer.parseInt(page), 10, Sort.by("createdAt").ascending());
        return transactionRepository.findAllByAccountAccountIdAndOwnerUid(accountId, user.getUid(), pageable).getContent();
    }

    public Transactions createAccountTransaction(double amount, Type type, double txFee, User user, Account account) {
        var tx = Transactions.builder()
                .txFee(txFee)
                .amount(amount)
                .type(type)
                .status(Status.COMPLETED)
                .owner(user)
                .account(account)
                .build();
        Transactions savedTx = transactionRepository.save(tx);
        eventPublisher.publishEvent(new TransactionCreatedEvent(this, savedTx));
        return savedTx;
    }

    public Transactions createCardTransaction(double amount, Type type, double txFee, User user, Card card) {
        Transactions tx = Transactions.builder()
                .txFee(txFee)
                .amount(amount)
                .type(type)
                .card(card)
                .status(Status.COMPLETED)
                .owner(user)
                .build();
        Transactions savedTx = transactionRepository.save(tx);
        eventPublisher.publishEvent(new TransactionCreatedEvent(this, savedTx));
        return savedTx;
    }
}