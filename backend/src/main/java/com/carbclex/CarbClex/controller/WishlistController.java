package com.carbclex.CarbClex.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.carbclex.CarbClex.model.Wishlist;
import com.carbclex.CarbClex.repository.WishlistRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/carbclex")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    // 1. Add new item to wishlist
    @PostMapping("/wishlist/add")
    public ResponseEntity<Wishlist> addToWishlist(@RequestBody Wishlist newItem) {
        newItem.setAddedAt(LocalDateTime.now());
        Wishlist savedItem = wishlistRepository.save(newItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }

    // 2. Get all wishlist items for a user
    @GetMapping("/wishlist/user/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlistByUser(@PathVariable String userId) {
        List<Wishlist> items = wishlistRepository.findByUserId(userId);
        return ResponseEntity.ok(items);
    }

    // 3. Delete wishlist item by id
    @DeleteMapping("/wishlist/delete/{id}")
    public ResponseEntity<?> deleteWishlistItem(@PathVariable Long id) {
        Optional<Wishlist> item = wishlistRepository.findById(id);
        if (item.isPresent()) {
            wishlistRepository.deleteById(id);
            return ResponseEntity.ok().body("Wishlist item deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Wishlist item not found");
        }
    }
}
