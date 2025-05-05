package com.pl.PasswordManager.Auth;

import com.pl.PasswordManager.Service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Slf4j
@RequiredArgsConstructor
public class LoginRequiredInterceptor implements HandlerInterceptor {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;


    @Override
    public boolean preHandle(@NonNull HttpServletRequest request,@NonNull HttpServletResponse response,@NonNull Object handler) throws IllegalAccessException {
        if (!(handler instanceof HandlerMethod handlerMethod) ||
                !handlerMethod.hasMethodAnnotation(LoginRequired.class)) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("No JWT token found in Authorization header");
            throw new IllegalAccessException("Authentication required");
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        if (username == null) {
            log.warn("Invalid token format");
            throw new IllegalAccessException("Invalid token");
        }

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        if (!jwtService.validateToken(token, userDetails)) {
            log.warn("Token validation failed for user {}", username);
            throw new IllegalAccessException("Invalid or expired token");
        }

        request.setAttribute("username", username);

        return true;
    }

}
