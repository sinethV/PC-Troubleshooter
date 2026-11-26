package com.techfixpro.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TechFix Pro IT Technician API")
                        .version("1.0.0")
                        .description("Professional IT technician diagnostics, command library, troubleshooting guides, and helpdesk management REST API.")
                        .contact(new Contact()
                                .name("TechFix Pro Engineering")
                                .email("support@techfixpro.local"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")))
                .servers(List.of(
                        new Server().url("/api/v1").description("TechFix Pro Base API Path")
                ));
    }
}
