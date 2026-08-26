package slbank.web.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SlBankApplication {

	public static void main(String[] args) {
		SpringApplication.run(SlBankApplication.class, args);
	}

}
