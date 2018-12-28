package com.micro.springcloud.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;

@RequestMapping("/enq")
@RestController
public class UserController {
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${micro.ribbon.addr}")
	private String ribbonAddr;
	
	
	@HystrixCommand(fallbackMethod="enqDoError")
	@RequestMapping("/enqDo")
	public String enqDo(@RequestParam String name) {
		String forObject = restTemplate.getForObject(ribbonAddr+"test/enq?enq="+name, String.class);
		return forObject;
	}
	
	public String enqDoError(String name) {
		return name+"is error";
	}
	
	
}
