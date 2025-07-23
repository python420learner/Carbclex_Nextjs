package com.carbclex.CarbClex.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PostConstruct;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${media.upload.path}")  // This will be /var/www/carbclex.com/uploads in prod
    private String mediaUploadPath;

    @PostConstruct
    public void logMediaPath() {
        System.out.println("📁 Spring Boot is exposing: " + mediaUploadPath);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + mediaUploadPath + "/");  // Ensure trailing slash
    }
}
