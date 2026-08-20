package com.vit.result;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ResultSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResultSystemApplication.class, args);
        System.out.println("\n========================================================");
        System.out.println(" Vishwakarma Institute of Technology Result System is running -> http://localhost:8080");
        System.out.println("========================================================\n");
    }
}
