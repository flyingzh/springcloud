package com.micro.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;

import com.micro.springcloud.filter.MyTokenFilter;

@SpringBootApplication
@EnableDiscoveryClient
@EnableZuulProxy
public class MicroZuulApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroZuulApplication.class, args);
	}
	
	@Bean
	public MyTokenFilter myTokenFilter() {
		return new MyTokenFilter();
	}
	
	
	
	
	
}

