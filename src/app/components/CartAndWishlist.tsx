"use client";
import { useState,useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CurrentCart } from './cart/CurrentCart';
import { Wishlist } from './cart/Wishlist';
import { ShoppingCart, Heart } from 'lucide-react';
import { Badge } from './ui/badge';
import { getCurrentUser } from '../firebase';
import { getGuestCart } from '../components/cartUtility';

export function CartAndWishlist() {
  const [activeTab, setActiveTab] = useState('cart');
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    getCurrentUser().then(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        const guestCart = getGuestCart();
        const userId = user.uid;
        setUserId(userId);

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

   useEffect(() => {
    if (!userId) return;
    fetch(`/api/wishlist/user/${userId}`)
      .then(res => res.json())
      .then(data => setWishlistItems(data))
      .catch(err => console.error('Failed to fetch wishlist:', err));
  }, [userId]);


  const cartItemCount = cartItems?.length || 0; // Replace with actual cart item count
  const wishlistItemCount = wishlistItems?.length || 0; // Replace with actual wishlist item count
  console.log('Wishlist Items:', wishlistItems);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="mx-auto grid w-full gap-2">
        <h1 className="text-3xl font-semibold">Cart & Wishlist</h1>
        <p className="text-muted-foreground">
          Manage your carbon credit purchases and explore projects you're interested in.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cart" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Current Cart
            {cartItemCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {cartItemCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Wishlist
            {wishlistItemCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {wishlistItemCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Current Cart
              </CardTitle>
              <CardDescription>
                Review your selected carbon credits before checkout. Items expire after 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <CurrentCart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Wishlist
              </CardTitle>
              <CardDescription>
                Explore and manage your saved carbon credit projects for future consideration.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Wishlist />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}