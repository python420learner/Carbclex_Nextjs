package com.carbclex.CarbClex.repository;

import com.carbclex.CarbClex.model.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, String> {
    List<CommentLike> findByCommentId(Long commentId);
    Optional<CommentLike> findByCommentIdAndUserId(Long commentId, String userId);
    long countByCommentId(Long commentId);
}
