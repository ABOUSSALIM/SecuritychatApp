package myapplication.chatApp;


import myapplication.chatApp.entities.AppRole;
import myapplication.chatApp.entities.AppUser;
import myapplication.chatApp.services.AccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;


@SpringBootApplication
@EnableGlobalMethodSecurity(prePostEnabled = true,securedEnabled = true)
public class ChatAppApplication {

	public static void main(String[] args) {

			SpringApplication.run(ChatAppApplication.class, args);

		}
        @Bean
		PasswordEncoder passwordEncoder(){
		return new BCryptPasswordEncoder();
		}

	@Bean
	CommandLineRunner start(AccountService accountService) {
			return args -> {
				// Ajouter des rôles
				accountService.addNewRole(new AppRole(null, "USER"));
				accountService.addNewRole(new AppRole(null, "ADMIN"));
				accountService.addNewRole(new AppRole(null, "CUSTOMER_MANAGER"));
				accountService.addNewRole(new AppRole(null, "PRODUCT_MANAGER"));
				accountService.addNewRole(new AppRole(null, "BILLS_MANAGER"));



			};
		}

	}
