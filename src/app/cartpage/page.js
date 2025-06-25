"use client"

import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../firebase';
import { getGuestCart } from '../components/cartUtility';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    getCurrentUser().then(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        const guestCart = getGuestCart();

        // ✅ Step 1: Merge guest cart into backend
        if (guestCart && guestCart.length > 0) {
          const normalizedCart = guestCart.map(item => ({
            ...item,
            productId: item.productId.toString()
          }));
          await fetch('/api/cart/merge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify(normalizedCart),
          });

          // Clear guest cart from localStorage after merging
          localStorage.removeItem('guestCart');
        }

        // ✅ Step 2: Fetch updated backend cart
        const response = await fetch('/api/cart', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        const data = await response.json();
        setCartItems(data);
      } else {
        // Guest user: Load cart from localStorage
        const guestCart = getGuestCart();
        setCartItems(guestCart);
      }
    });
  }, []);

  const handleQuantityChange = async (productId, delta) => {
    const user = await getCurrentUser();

    if (user) {
      const idToken = await user.getIdToken();

      await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          productId: String(productId), // Ensure string if needed
          delta: delta,
        }),
      });

      // Re-fetch updated cart
      fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data));
    } else {
      // Guest user (localStorage)
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      let updatedCart = guestCart.map((item) => {
        if (item.productId === productId) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);

      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    }
  };



  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id || item.productId} className="border rounded p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{item.productName}</h3>
                  <p className="text-gray-600">Price: ₹{item.price}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId, -1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right font-bold text-lg">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}

            <div className="mt-6 text-right text-xl font-semibold">
              Total: ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>

  )
}


export default CartPage;