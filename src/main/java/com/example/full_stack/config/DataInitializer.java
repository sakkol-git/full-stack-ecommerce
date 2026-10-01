package com.example.full_stack.config;

import com.example.full_stack.entity.Product;
import com.example.full_stack.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds the H2 in-memory database with sample products on startup.
 * Remove or comment out in production environments.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

        @Bean
        CommandLineRunner seedDatabase(ProductRepository repo) {
                return args -> {
                        if (repo.count() > 0) {
                                log.info("Database already has data – skipping seed");
                                return;
                        }

                        var products = List.of(
                                        product("Mechanical Keyboard", "Tactile 87-key TKL with RGB backlighting",
                                                        "149.99",
                                                        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400"),
                                        product("4K Webcam", "Ultra-HD 4K streaming webcam with noise-cancelling mic",
                                                        "89.00",
                                                        "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400"),
                                        product("USB-C Docking Station",
                                                        "12-in-1 hub: HDMI 4K, USB 3.0, PD 100W, SD card", "79.50",
                                                        "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=400"),
                                        product("Noise-Cancelling Headphones",
                                                        "Active noise cancellation, 30h battery, foldable", "299.00",
                                                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"),
                                        product("Ergonomic Mouse",
                                                        "Vertical design, wireless 2.4GHz, 6 programmable buttons",
                                                        "49.99",
                                                        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"),
                                        product("Monitor Light Bar",
                                                        "Asymmetric optical lens, no screen glare, USB-C power",
                                                        "39.99",
                                                        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400"));

                        repo.saveAll(products);
                        log.info("Seeded {} products into the database", products.size());
                };
        }

        private Product product(String name, String description, String price, String image) {
                var p = new Product();
                p.setName(name);
                p.setDescription(description);
                p.setPrice(new BigDecimal(price));
                p.setImage(image);
                return p;
        }
}
