package com.carbclex.CarbClex.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carbclex.CarbClex.model.Wishlist;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(String userId);
}
