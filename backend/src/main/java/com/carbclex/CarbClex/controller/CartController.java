package com.carbclex.CarbClex.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.carbclex.CarbClex.model.CartItem;
import com.carbclex.CarbClex.repository.CartItemRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/carbclex")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    // 🔹 Utility method to extract UID from token
    private String extractUidFromToken(String idToken) throws Exception {
        if (idToken.startsWith("Bearer ")) {
            idToken = idToken.substring(7);
        }
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        return decodedToken.getUid();
    }

    // ✅ Add to cart
    @PostMapping("/cart/add")
    public ResponseEntity<?> addToCart(
            @RequestBody CartItem item,
            @RequestHeader("Authorization") String idToken) {
        try {
            String uid = extractUidFromToken(idToken);

            Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(uid, item.getProductId());
            if (existingItem.isPresent()) {
                return ResponseEntity.badRequest().body("Item already in cart. Use /update to modify quantity.");
            }

            item.setUserId(uid);
            item.setQuantity(1); // default
            return ResponseEntity.ok(cartItemRepository.save(item));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or session.");
        }
    }

    // ✅ Update quantity (+1 / -1)
    @PutMapping("/cart/update")
    public ResponseEntity<?> updateQuantity(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String idToken) {
        try {
            String uid = extractUidFromToken(idToken);

            String productId = String.valueOf(payload.get("productId"));
            int delta = Integer.parseInt(payload.get("delta").toString());
            System.out.println("Project id is" + productId);

            Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(uid, productId);
            System.out.println(existingItem);
            if (existingItem.isEmpty()) {
                return ResponseEntity.badRequest().body("Item not found in cart.");
            }

            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + delta;

            if (newQuantity <= 0) {
                cartItemRepository.delete(item);
                return ResponseEntity.ok("Item removed from cart.");
            }

            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or session.");
        }
    }

    // ✅ Get all cart items for the logged-in user
    @GetMapping("/cart")
    public ResponseEntity<?> getCart(@RequestHeader("Authorization") String idToken) {
        try {
            String uid = extractUidFromToken(idToken);
            System.out.println("this is the uid for the user from the fronted "+uid);
            return ResponseEntity.ok(cartItemRepository.findByUserId(uid));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or session.");
        }
    }

    // ✅ Remove specific item
    @DeleteMapping("/cart/remove")
    public ResponseEntity<?> removeItem(
            @RequestHeader("Authorization") String idToken,
            @RequestParam String productId) {
        try {
            String uid = extractUidFromToken(idToken);

            Optional<CartItem> item = cartItemRepository.findByUserIdAndProductId(uid, productId);
            item.ifPresent(cartItemRepository::delete);
            return ResponseEntity.ok("Item removed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or session.");
        }
    }

    // ✅ Clear full cart
    @DeleteMapping("/cart/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String idToken) {
        try {
            String uid = extractUidFromToken(idToken);
            cartItemRepository.deleteByUserId(uid);
            return ResponseEntity.ok("Cart cleared");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or session.");
        }
    }

    // ✅ Merge guest cart
    @Transactional
    @PostMapping("/cart/merge")
    public ResponseEntity<?> mergeCart(
            @RequestBody List<CartItem> items,
            @RequestHeader("Authorization") String idToken) {
        try {
            String uid = extractUidFromToken(idToken);
            for (CartItem item : items) {
                String productId = String.valueOf(item.getProductId());
                item.setUserId(uid);
                Optional<CartItem> existing = cartItemRepository.findByUserIdAndProductId(uid, productId);
                System.out.println(existing);

                if (existing.isPresent()) {
                    CartItem existingItem = existing.get();
                    existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
                    cartItemRepository.save(existingItem);
                } else {
                    // cartItemRepository.save(item);
                    CartItem newItem = new CartItem();
                    newItem.setUserId(uid);
                    newItem.setProductId(item.getProductId());
                    newItem.setProductName(item.getProductName());
                    newItem.setPrice(item.getPrice());
                    newItem.setQuantity(item.getQuantity());
                    cartItemRepository.save(newItem);
                }
            }
            return ResponseEntity.ok("Cart merged successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token or session.");
        }
    }

    @GetMapping("/cart/{id}")
    public ResponseEntity<?> getCartItemById(@PathVariable Long id) {
        Optional<CartItem> item = cartItemRepository.findById(id);
        System.out.println("Fetching cart item with ID: " + id);
        System.out.println("Item found: " + item.isPresent());
        if (item.isPresent()) {
            return ResponseEntity.ok(item.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found");
        }
    }

    @Scheduled(fixedRate = 60000) // every 1 minute OR trigger this manually
    @Transactional
    public void cleanUpDuplicates() {
        cartItemRepository.removeDuplicateCartItems();
    }
}
