package com.carbclex.CarbClex.repository;

import com.carbclex.CarbClex.model.NewsletterSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NewsletterRepository extends JpaRepository<NewsletterSubscription, Long> {
    Optional<NewsletterSubscription> findByEmail(String email);
}
