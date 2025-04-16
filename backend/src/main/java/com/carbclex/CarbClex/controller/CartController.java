package com.carbclex.CarbClex.controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.carbclex.CarbClex.model.CartItem;
import com.carbclex.CarbClex.service.CartService;;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public List<CartItem> addToCart(@RequestBody CartItem item) {
        cartService.addToCart(item);
        return cartService.getCart();
    }

    @PostMapping("/remove")
    public List<CartItem> removeFromCart(@RequestBody Long productId) {
        cartService.removeFromCart(productId);
        return cartService.getCart();
    }

    @GetMapping("/items")
    public List<CartItem> getCart() {
        return cartService.getCart();
    }

    @PostMapping("/clear")
    public void clearCart() {
        cartService.clearCart();
    }
}