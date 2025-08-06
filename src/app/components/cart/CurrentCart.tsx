"use client";
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { getCurrentUser } from '../../firebase';
import { getGuestCart } from '../../components/cartUtility';
import { Trash2, Heart, Plus, Minus, ExternalLink, Clock, AlertTriangle, ShoppingCart } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import CartRow from './CartRow';

export function CurrentCart() {
  const [cartItems, setCartItems] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

  const updateQuantity = async (productId, delta) => {
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

  const removeItem = async (productId) => {
    const user = await getCurrentUser(); // Your function to get the logged-in user
    if (!user) {
      alert('Log in required!');
      return;
    }
    const idToken = await user.getIdToken();

    try {
      const res = await fetch(
        `/api/cart/remove?productId=${encodeURIComponent(productId)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      if (res.ok) {
        // Optionally update cart state in frontend
        // Remove item locally or re-fetch the cart
        setCartItems(items => items.filter(item => item.productId !== productId));
      } else {
        alert('Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Something went wrong!');
    }
  };

  const getTimeRemaining = (createdAt: Date) => {
    const diff = new Date(createdAt).getTime() - new Date().getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes, isExpiring: hours < 1 };
  };

  const getCreditTypeColor = (type) => {
    switch (type) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCreditTypeIcon = (type) => {
    switch (type) {
      case 'blue':
        return '🌊';
      case 'green':
        return '🌱';
      case 'gold':
        return '⭐';
      default:
        return '♻️';
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalCO2Offset = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4 p-6">
      {/* Low Stock Alert */}
      {cartItems.some(item => item.stockLeft < 20) && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Some items in your cart have limited stock remaining. Complete your purchase soon to avoid disappointment.
          </AlertDescription>
        </Alert>
      )}

      {/* Cart Items Table */}
      <div className="rounded-md border border-(--muted-foreground)/25">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Credit Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Price/Tonne</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Expires</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              cartItems.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))
            }
          </TableBody>
        </Table>
      </div>

      {cartItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-4">Browse our marketplace to find carbon credits that match your needs.</p>
          <Button>Browse Projects</Button>
        </div>
      )}

      {/* Sticky Action Area */}
      {cartItems.length > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">
                    ${cartTotal.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total CO₂ Offset: {totalCO2Offset} tonnes
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  All credits certified by Verra / Gold Standard
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="lg">
                  Save Cart
                </Button>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}