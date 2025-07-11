package com.carbclex.CarbClex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@SpringBootApplication
@EnableTransactionManagement
@EnableGlobalMethodSecurity(prePostEnabled = true)


public class CarbClexApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarbClexApplication.class, args);
	}

} 