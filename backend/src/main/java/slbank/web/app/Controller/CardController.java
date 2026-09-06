package slbank.web.app.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import slbank.web.app.entity.Card;
import slbank.web.app.entity.Transactions;
import slbank.web.app.entity.User;
import slbank.web.app.service.CardService;

@RestController
@RequestMapping("/card")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping
    public ResponseEntity<Card> getCard(Authentication authentication){
        var user =(User) authentication.getPrincipal();
        return ResponseEntity.ok(cardService.getCard(user));
    }

    @PostMapping("/create")
    public ResponseEntity<Card> createCard(@RequestParam double amount, Authentication  authentication) throws Exception {
        var user =(User) authentication.getPrincipal();
        return ResponseEntity.ok(cardService.createCard(amount, user));
    }

    @PostMapping("/credit")
    public ResponseEntity<Transactions> creditCard(@RequestParam double amount, Authentication  authentication){
        var user =(User) authentication.getPrincipal();
        return ResponseEntity.ok(cardService.creditCard(amount, user));
    }

    @PostMapping("/debit")
    public ResponseEntity<Transactions> debitCard(@RequestParam double amount, Authentication  authentication){
        var user =(User) authentication.getPrincipal();
        return ResponseEntity.ok(cardService.debitCard(amount, user));
    }
}
