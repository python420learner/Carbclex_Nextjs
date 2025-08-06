"use client"
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Filter, ShoppingCart, X, Heart, TrendingDown, Bell, Share2, MapPin, Award } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import WishlistCard from './WishlistCard';
import { set } from 'react-hook-form';
// import { ImageWithFallback } from '../figma/ImageWithFallback';

export function Wishlist() {
  const [sortBy, setSortBy] = useState<string>('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter_creditType, setCreditType] = useState("all");
  const [filter_projectType, setFilter_projectType] = useState("all");
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setUserId(user.uid);
      } else {
        setUserId("");
        setWishlist([]);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/wishlist/user/${userId}`)
      .then(res => res.json())
      .then(data => setWishlist(data))
      .catch(err => console.error('Failed to fetch wishlist:', err));
  }, [userId]);

  const filteredWishlist = wishlist.filter(item => {
    // Filter by searchTerm (name or location)
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesName = item.projectName?.toLowerCase().includes(lowerSearch);
      // const matchesLocation = project.locationDetails?.toLowerCase().includes(lowerSearch); // or region, or address field
      // if (!matchesName && !matchesLocation) return false;
      if (!matchesName) return false;
    }

    // Filter by verification status
    if (filter_creditType !== 'all' && item.creditType !== filter_creditType)
      return false;
    // Filter by project type
    if (filter_projectType !== 'all' && item.projectType !== filter_projectType)
      return false;

    return true; // Passed all filters
  });

  const sortedItems = [...filteredWishlist].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.pricePerTonne - b.pricePerTonne;
      case 'price_high':
        return b.pricePerTonne - a.pricePerTonne;
      case 'recent':
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      default:
        return 0;
    }
  });

  const removeFromWishlist = async (id) => {
    try {
      const res = await fetch(`/api/wishlist/delete/${id}`, {
        method: 'DELETE',
        // Include headers if your backend requires auth tokens etc.
        // headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to delete wishlist item');
      }

      // Update state by removing deleted item
      setWishlist((prev) => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error(error);
      alert('Error removing wishlist item');
    }
  };

  const toggleNotification = (id: string, type: 'price' | 'available') => {
    setWishlist(items =>
      items.map(item =>
        item.id === id
          ? {
            ...item,
            [type === 'price' ? 'notifyOnPrice' : 'notifyOnAvailable']: !item[type === 'price' ? 'notifyOnPrice' : 'notifyOnAvailable']
          }
          : item
      )
    );
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

  return (
    <div className="space-y-6 p-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wishlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filter_projectType} onValueChange={setFilter_projectType}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Agriculture">Agriculture</SelectItem>
              <SelectItem value="Carbon_capture">Carbon Capture</SelectItem>
              <SelectItem value="Renewable">Renewable</SelectItem>
              <SelectItem value="Reforestation">Reforestation</SelectItem>
              <SelectItem value="Energy_efficiency">Energy Efficiency</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filter_creditType} onValueChange={setCreditType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedItems.map((item) => (
          <WishlistCard
            key={item.id}
            item={item}
            user={user}
            removeFromWishlist={() => removeFromWishlist(item.id)}
            toggleNotification={(type) => toggleNotification(item.id, type)}
          // creditTypeColor={getCreditTypeColor(item.creditType)}
          // creditTypeIcon={getCreditTypeIcon(item.creditType)}
          />
        ))}
      </div>

      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filter_projectType !== 'all' || filter_creditType !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Your wishlist is empty. Browse our marketplace to discover projects.'}
          </p>
          <Button>Browse Projects</Button>
        </div>
      )}
    </div>
  );
}