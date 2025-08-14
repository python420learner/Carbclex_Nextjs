// utils/cart.js

const GUEST_CART_KEY = "guestCart";

// Get guest cart from localStorage
export const getGuestCart = () => {
    if (typeof window === "undefined") return [];
    const storedCart = localStorage.getItem(GUEST_CART_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
};

// Add a product to guest cart (default quantity: 1)
export const addToGuestCart = (product) => {
    const cart = getGuestCart();
    const index = cart.findIndex((item) => item.productId === product.id);

    if (index === -1) {
        cart.push({ productId: product.id, quantity: 1, ...product });
    } else {
        cart[index].quantity += 1;
    }

    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

// Update quantity in guest cart
export const updateGuestCartItem = (productId, delta) => {
    let cart = getGuestCart();
    const index = cart.findIndex((item) => item.productId === productId);

    if (index !== -1) {
        cart[index].quantity += delta;

        // Remove item if quantity <= 0
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    }
};

// Clear guest cart (used after merging with backend)
export const clearGuestCart = () => {
    localStorage.removeItem(GUEST_CART_KEY);
};


export const mergeGuestCartToUserCart = async (guestCart, idToken) => {
    if (!guestCart || guestCart.length === 0) return;
    // if (localStorage.getItem('cart_merged')) return; // 🛑 Prevent re-merge 

    // Convert productId to string
    const normalizedCart = guestCart.map(item => ({
        ...item,
        productId: item.productId.toString()
    }));


    try {
        await fetch(`/api/cart/merge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify(normalizedCart),
        })

        // Optionally clear localStorage cart after merging
        localStorage.removeItem(GUEST_CART_KEY);


    } catch (err) {
        console.error("Cart merge failed", err);
    }
};

export const saveGuestCart = (cartItems) => {
    try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
        console.error("Failed to save guest cart:", error);
    }
};