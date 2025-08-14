import React from 'react'
import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
// import { ImageWithFallback } from './figma/ImageWithFallback';
import {
    Calendar,
    MapPin,
    User,
    Clock,
    Eye,
    Share2,
    Bookmark,
    ThumbsUp,
    MessageCircle,
    ArrowRight,
    Quote
} from 'lucide-react';
import { motion } from 'framer-motion';

const SecondaryFooterForBlog = () => {

    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [comments, setComments] = useState([]);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        // In a real app, you might show a toast notification here
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    // if (comments.length === 0) {
    //     return (
    //         <div>
    //             <h2>
    //                 No comments, start by adding yours
    //             </h2>
    //         </div>
    //     )
    // }

    return (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={handleLike}
                            className={`flex items-center gap-2 ${isLiked ? 'text-red-600 border-red-200 bg-red-50' : ''}`}
                        >
                            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            {likes} Likes
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Comments
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBookmark}
                            className={isBookmarked ? 'text-green-600 border-green-200 bg-green-50' : ''}
                        >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <Separator className="mb-8" />
            </div>
        </section>
    )
}

export default SecondaryFooterForBlog