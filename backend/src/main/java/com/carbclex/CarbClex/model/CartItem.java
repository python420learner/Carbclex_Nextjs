// CartItem.java
package com.carbclex.CarbClex.model;
import java.io.Serializable;
import java.math.BigDecimal;


// public class CartItem {
//     private String productId;
//     private int quantity;

//     // Constructor
//     public CartItem(String productId, int quantity) {
//         this.productId = productId;
//         this.quantity = quantity;
//     }

//     // Getters
//     public String getProductId() {
//         return productId;
//     }

//     public int getQuantity() {
//         return quantity;
//     }

//     // Setters
//     public void setProductId(String productId) {
//         this.productId = productId;
//     }

//     public void setQuantity(int quantity) {
//         this.quantity = quantity;
//     }
// }
public class CartItem implements Serializable {
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
    
    // Constructors
    public CartItem() {}
    
    public CartItem(Long productId, String productName, Integer quantity, BigDecimal price) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
    }
    
    // Getters and Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}