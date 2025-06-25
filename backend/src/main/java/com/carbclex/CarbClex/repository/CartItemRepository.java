
package com.carbclex.CarbClex.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.carbclex.CarbClex.model.CartItem;

import jakarta.transaction.Transactional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(String userId);

    void deleteByUserId(String userId);

    Optional<CartItem> findByUserIdAndProductId(String userId, String productId);

    @Modifying
    @Transactional
    @Query(value = """
                DELETE ci1 FROM cart_items ci1
                INNER JOIN cart_items ci2
                ON ci1.user_id = ci2.user_id
                AND ci1.product_id = ci2.product_id
                AND ci1.id > ci2.id
            """, nativeQuery = true)
    void removeDuplicateCartItems();
}
