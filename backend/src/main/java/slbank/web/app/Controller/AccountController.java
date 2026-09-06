package slbank.web.app.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import slbank.web.app.dto.AccountDto;
import slbank.web.app.dto.ConvertDto;
import slbank.web.app.dto.TransferDto;
import slbank.web.app.entity.Account;
import slbank.web.app.entity.Transactions;
import slbank.web.app.entity.User;
import slbank.web.app.service.AccountService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody AccountDto accountDto, Authentication authentication) throws Exception {
        var user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(accountService.createAccount(accountDto, user));
    }

    @GetMapping
    public ResponseEntity<List<Account>> getUserAccounts(Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(accountService.getUserAccounts(user.getUid()));
    }

    @PostMapping("/transfer")
    public ResponseEntity<Transactions> transferFunds(@RequestBody TransferDto transferDto, Authentication authentication) throws Exception {
        var user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(accountService.transferFunds(transferDto, user));
    }

    @GetMapping("/rates")
    public ResponseEntity<Map<String, Double>> getExchangeRates(){
        return ResponseEntity.ok(accountService.getExchangeRates());
    }

    @PostMapping("/convert")
    public ResponseEntity<Transactions> convertCurrency(@RequestBody ConvertDto convertDto, Authentication authentication) throws Exception {
        var user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(accountService.convertCurrency(convertDto, user));
    }
}
