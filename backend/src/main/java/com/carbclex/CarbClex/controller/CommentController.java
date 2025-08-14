package com.carbclex.CarbClex.controller;

import com.carbclex.CarbClex.model.Comment;
import com.carbclex.CarbClex.model.CommentLike;
import com.carbclex.CarbClex.repository.CommentRepository;
import com.carbclex.CarbClex.repository.CommentLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carbclex/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    // ✅ Get all comments for a post
    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    // ✅ Create new comment or reply
    @PostMapping("/post/{postId}")
    public Comment createComment(@PathVariable Long postId,
                                 @RequestParam String userId,
                                 @RequestParam(required = false) Long parentId,
                                 @RequestParam String content) {
        Comment comment = new Comment(postId, userId, parentId, content);

        // If it's a reply, increment parent's repliesCount
        if (parentId != null) {
            commentRepository.findById(parentId).ifPresent(parent -> {
                parent.setRepliesCount(parent.getRepliesCount() + 1);
                commentRepository.save(parent);
            });
        }

        return commentRepository.save(comment);
    }

    // ✅ Like a comment
    @PostMapping("/{commentId}/like")
    public String likeComment(@PathVariable Long commentId, @RequestParam String userId) {
        if (commentLikeRepository.findByCommentIdAndUserId(commentId, userId).isPresent()) {
            return "Already liked";
        }

        // Save like
        CommentLike like = new CommentLike(commentId, userId);
        commentLikeRepository.save(like);

        // Increment likes count
        commentRepository.findById(commentId).ifPresent(comment -> {
            comment.setLikesCount(comment.getLikesCount() + 1);
            commentRepository.save(comment);
        });

        return "Liked successfully";
    }

    // ✅ Unlike a comment
    @DeleteMapping("/{commentId}/like")
    public String unlikeComment(@PathVariable Long commentId, @RequestParam String userId) {
        return commentLikeRepository.findByCommentIdAndUserId(commentId, userId)
                .map(like -> {
                    commentLikeRepository.delete(like);

                    // Decrement likes count
                    commentRepository.findById(commentId).ifPresent(comment -> {
                        comment.setLikesCount(Math.max(0, comment.getLikesCount() - 1));
                        commentRepository.save(comment);
                    });

                    return "Unliked successfully";
                })
                .orElse("Not liked before");
    }

    // ✅ Get all users who liked a comment
    @GetMapping("/{commentId}/likes")
    public List<CommentLike> getLikesForComment(@PathVariable Long commentId) {
        return commentLikeRepository.findByCommentId(commentId);
    }

    // ✅ Check if specific user liked the comment
    @GetMapping("/{commentId}/liked-by/{userId}")
    public boolean hasUserLikedComment(@PathVariable Long commentId, @PathVariable String userId) {
        return commentLikeRepository.findByCommentIdAndUserId(commentId, userId).isPresent();
    }
}
