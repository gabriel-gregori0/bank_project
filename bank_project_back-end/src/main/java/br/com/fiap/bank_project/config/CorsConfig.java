package br.com.fiap.bank_project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite origens específicas
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://127.0.0.1:3000");
        
        // Permite todos os headers
        config.addAllowedHeader("*");
        
        // Permite todos os métodos (GET, POST, etc)
        config.addAllowedMethod("*");
        
        // Permite credenciais
        config.setAllowCredentials(true);
        
        // Aplica esta configuração para todas as rotas
        source.registerCorsConfiguration("/api/**", config);
        
        return new CorsFilter(source);
    }
}