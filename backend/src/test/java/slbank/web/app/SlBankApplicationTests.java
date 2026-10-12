package slbank.web.app;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.boot.test.mock.mockito.MockBean;
import slbank.web.app.service.ExchangeRateScheduleTaskRunnerComponent;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class SlBankApplicationTests {

    @MockBean
    private ExchangeRateScheduleTaskRunnerComponent taskRunner;

	@Test
	void contextLoads() {
	}

}
