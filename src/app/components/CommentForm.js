import React, { useState } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebase'

export default function CommentForm({ postId, onCommentAdded }) {
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const auth = getAuth(app);

    console.log(userId)

    const fetchUser = () => {
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserId(user.uid);
                    resolve(user.uid); // ✅ Resolve with UID
                } else {
                    router.push('/auth');
                    reject("No user logged in");
                }
            }, reject);
        });
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        const auth = getAuth(app);
        const currentUser = auth.currentUser;


        if (!currentUser) {
            alert('Please login to add comment');
            router.push('/auth');
            return;
        }

        if (!commentText.trim()) {
            alert("Please enter a comment before submitting.");
            return;
        }
        const uid = currentUser.uid;
        setUserId(uid)
        console.log("Posting comment as:", uid);

        setLoading(true);

        try {
            const response = await axios.post(
                `/api/comments/post/${postId}`,
                null, // no JSON body, params are sent via URL query
                {
                    params: {
                        userId: uid,
                        content: commentText
                        // parentId: optional — only needed for replies
                    }
                }
            );

            alert("Comment added successfully!");
            setCommentText("");

            // Refresh comments list
            if (onCommentAdded) onCommentAdded(response.data);
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleAddComment} style={{ display: "flex", gap: "10px" }}>
            <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ flex: 1 }}
            />
            <button type="submit" disabled={loading}>
                {loading ? "Posting..." : "Post"}
            </button>
        </form>
    );
}
