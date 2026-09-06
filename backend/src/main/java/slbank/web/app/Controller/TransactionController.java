package slbank.web.app.Controller;

import slbank.web.app.entity.Transactions;
import slbank.web.app.entity.User;
import slbank.web.app.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public List<Transactions> getAllTransactions(@RequestParam String page, Authentication auth) {
        return transactionService.getAllTransactions(page, (User) auth.getPrincipal());
    }

    @GetMapping("/c/{cardId}")
    public List<Transactions> getTransactionsByCardId(@PathVariable String cardId, @RequestParam String page, Authentication auth) {
        return transactionService.getTransactionsByCardId(cardId, page, (User) auth.getPrincipal());
    }

    @GetMapping("/a/{accountId}")
    public List<Transactions> getTransactionsByAccountId(@PathVariable String accountId, @RequestParam String page, Authentication auth) {
        return transactionService.getTransactionsByAccountId(accountId, page, (User) auth.getPrincipal());
    }
}