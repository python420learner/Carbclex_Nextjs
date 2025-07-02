'use client'
import React, { useState, useEffect } from "react";
import { getCurrentUser, getIdToken } from "../firebase";
import { mergeGuestCartToUserCart, getGuestCart, saveGuestCart } from "./cartUtility";
import Link from "next/link";
import {useRouter} from "next/navigation";

const Cart = ({ project }) => {
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(100)
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isInCart, setIsInCart] = useState(false);
  const currentProjectId = project.projectid;
  const router = useRouter();

  useEffect(() => {
    let didRun = false;

    const fetchCart = async () => {
      if (didRun) return;

      const user = await getCurrentUser();
      setUser(user);

      if (user) {
        const idToken = await user.getIdToken();
        const guestCart = getGuestCart();

        await mergeGuestCartToUserCart(guestCart, idToken); // ✅ now safe

        fetch(`/api/cart`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
          .then((res) => res.json())
          .then((data) => setCartItems(data));
          router.refresh(); // This will reload the page
      } else {
        const localCart = getGuestCart();
        setCartItems(localCart);
      }

      didRun = true;

    };

    fetchCart();
  }, []);


  useEffect(() => {

    getCurrentUser().then(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        // Logged-in user: Fetch cart from backend
        fetch(`/api/cart`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
          .then((res) => res.json())
          .then((cartItems) => {
            const found = cartItems.some(item => item.productId == currentProjectId);
            const item = cartItems.find(item => item.productId == currentProjectId);
            setQuantity(item ? item.quantity : 0);
            setIsInCart(found);
          });
      } else {
        // Guest user: Check from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        const found = guestCart.some(item => item.productId == currentProjectId);
        const item = guestCart.find(item => item.productId == currentProjectId);
        setQuantity(item ? item.quantity : 0);
        setIsInCart(found);
      }
    });
  }, [currentProjectId]);

  const handleAddToCart = async (product) => {
    const user = await getCurrentUser();

    if (user) {
      const idToken = await user.getIdToken();

      // 🔐 Add to backend cart
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ productId: product.projectid, productName: product.projectName }),
      });
    } else {
      // 🛒 Guest → update local storage
      const cart = getGuestCart() || [];
      const existing = cart.find((item) => item.productId === product.projectid);
      if (!existing) {
        cart.push({ productId: product.projectid, quantity: 1, productName: product.projectName });
      }
      saveGuestCart(cart);
    }
    setIsInCart(true)
    setQuantity(1)
  };

  const handleIncrease = async () => {
    if (user) {
      const idToken = await user.getIdToken();
      await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          productId: currentProjectId,
          delta: 1
        }),
      });
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const updatedCart = guestCart.map(item =>
        item.productId == currentProjectId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
    }

    // 🟢 Immediately update UI
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = async () => {
    if (quantity <= 0) return;

    if (user) {
      const idToken = await user.getIdToken();
      await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          productId: currentProjectId,
          delta: -1,
        }),
      });
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const updatedCart = guestCart
        .map(item =>
          item.productId == currentProjectId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0); // remove if quantity becomes 0
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
    }

    // 🟢 Immediately update UI
    setQuantity((prev) => Math.max(prev - 1, 0));
  };


  return (
    <div className='grad_border' style={{ display: 'flex', height: 'fit-content', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem 4rem', marginTop: '6rem', marginRight: '3rem' }}>
      <h3 className='grad_text'>OFFSET WITH <br /> THIS PROJECT</h3>

      {quantity > 0 ? (

        <span style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button style={{ color: '#37AE56', width: '2rem', fontSize: 'large', backgroundColor: 'white', border: 'none' }} onClick={handleDecrease}>-</button>
          <h3 id='quantity' style={{ border: '2px solid grey', padding: '.5rem 3rem' }}>{quantity}</h3>
          <button style={{ color: '#37AE56', width: '2rem', fontSize: 'large', backgroundColor: 'white', border: 'none' }} onClick={handleIncrease}>+</button>
        </span>
      ) : (
        <div></div>
      )}
      <button className="grad_border" style={{ color: 'white', backgroundImage: 'linear-gradient(to right,#37AE56,#1A93D7)', fontWeight: 'bold', paddingBlock: '1rem', width: '13rem', backgroundColor: 'white' }}>Buy Now</button>
      {quantity > 0 ? (
        <Link href="/cartpage"><button className="grad_border grad_text" style={{ paddingBlock: '1rem', width: '13rem', backgroundColor: 'white', fontWeight: 'bold' }} >Go to Cart</button></Link>
      ) : (
        <button className="grad_border grad_text" style={{ paddingBlock: '1rem', width: '13rem', backgroundColor: 'white', fontWeight: 'bold' }} onClick={() => handleAddToCart(project)}>Add to Cart</button>
      )}
    </div>
  );
};

export default Cart;