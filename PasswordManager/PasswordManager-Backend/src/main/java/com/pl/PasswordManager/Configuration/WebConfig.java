//package com.pl.PasswordManager.Configuration;
//
//import com.pl.PasswordManager.Auth.LoginRequiredInterceptor;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//@RequiredArgsConstructor
//public class WebConfig implements WebMvcConfigurer {
//
//    private final LoginRequiredInterceptor loginRequiredInterceptor;
//
//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(loginRequiredInterceptor)
//                .addPathPatterns("/api/**")
//                .excludePathPatterns("/api/login", "/api/register");
//    }
//}
//
