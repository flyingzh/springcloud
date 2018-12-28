package com.micro.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MicroRibbonApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroRibbonApplication.class, args);
	}

}

