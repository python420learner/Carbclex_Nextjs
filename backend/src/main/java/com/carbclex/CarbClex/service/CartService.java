package com.carbclex.CarbClex.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.carbclex.CarbClex.model.CartItem;
import com.carbclex.CarbClex.repository.CartItemRepository;


@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getCartByUser(String userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public void syncCart(List<CartItem> items, String userId) {
        cartItemRepository.deleteByUserId(userId);
        for (CartItem item : items) {
            item.setUserId(userId);
            cartItemRepository.save(item);
        }
    }

    public CartItem updateCartItem(String userId, CartItem update) {
        Optional<CartItem> optionalItem = cartItemRepository.findByUserIdAndProductId(userId, update.getProductId());

        if (optionalItem.isPresent()) {
            CartItem existing = optionalItem.get();
            int newQuantity = existing.getQuantity() + update.getQuantity();

            if (newQuantity <= 0) {
                cartItemRepository.delete(existing);
                return null; // item removed
            } else {
                existing.setQuantity(newQuantity);
                return cartItemRepository.save(existing);
            }

        } else {
            if (update.getQuantity() > 0) {
                update.setUserId(userId);
                return cartItemRepository.save(update);
            } else {
                return null;
            }
        }
    }

    public void clearCart(String userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}



// @Service
// public class CartService {

//     private static final String CART_SESSION_KEY = "shopping_cart";

//     // Get the current session
//     private HttpSession getSession() {
//         ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
//         if (attr == null) {
//             throw new IllegalStateException("No session found for the current request!");
//         }
//         return attr.getRequest().getSession();
//     }

//     // Retrieve the cart from the session or initialize it if it doesn't exist
//     private List<CartItem> getCartFromSession() {
//         HttpSession session = getSession(); // Fetch the current session
//         List<CartItem> cart = (List<CartItem>) session.getAttribute(CART_SESSION_KEY);
//         if (cart == null) {
//             cart = new ArrayList<>();
//             session.setAttribute(CART_SESSION_KEY, cart);
//         }
//         return cart;
//     }

//     // Add an item to the cart
//     public void addToCart(CartItem item) {
//         List<CartItem> cart = getCartFromSession();
//         Optional<CartItem> existingItem = cart.stream()
//                 .filter(i -> i.getProductId().equals(item.getProductId()))
//                 .findFirst();

//         if (existingItem.isPresent()) {
//             // If the item already exists in the cart, update its quantity
//             CartItem cartItem = existingItem.get();
//             cartItem.setQuantity(cartItem.getQuantity() + item.getQuantity());
//         } else {
//             // Add a new item to the cart
//             cart.add(item);
//         }
//     }

//     // Remove an item from the cart by productId
//     public void removeFromCart(Long productId) {
//         List<CartItem> cart = getCartFromSession();
//         cart.removeIf(item -> item.getProductId().equals(productId));
//     }

//     // Get all items in the cart
//     public List<CartItem> getCart() {
//         return getCartFromSession();
//     }

//     // Clear the cart
//     public void clearCart() {
//         HttpSession session = getSession();
//         session.removeAttribute(CART_SESSION_KEY);
//     }
// }
