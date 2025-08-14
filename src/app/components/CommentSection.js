import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentForm from "./CommentForm";





/**
 * Returns the currently signed-in user's UID from Firebase Auth.
 * @returns {string|null} Firebase UID or null if no user is logged in.
 */
function getUserId() {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    if (currentUser) {
        return currentUser.uid; // This is the unique userId from Firebase
    } else {
        return null; // No user logged in
    }
}

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);


    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `/api/comments/post/${postId}`
            );
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <div>
            <h3>Comments</h3>
            <CommentForm postId={postId} onCommentAdded={fetchComments} />
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <p>
                            <strong>User {comment.userId}:</strong> {comment.content}
                        </p>
                        <small>
                            Likes: {comment.likesCount} | Replies: {comment.repliesCount} |{" "}
                            {new Date(comment.createdAt).toLocaleString()}
                        </small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
