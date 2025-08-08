package com.swimsearch.project25;

import com.swimsearch.project25.BoardPost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/board")
public class BoardController {
    private final BoardPostRepository postRepository;
    private final ReplyRepository replyRepository;

    public BoardController(BoardPostRepository postRepository, ReplyRepository replyRepository) {
        this.postRepository = postRepository;
        this.replyRepository = replyRepository;
    }

    @GetMapping
    public List<BoardPost> getPosts() {
        return postRepository.findAll();
    }

    @PostMapping
    public BoardPost createPost(@RequestBody BoardPost post) {
        return postRepository.save(post);
    }

    @GetMapping("/{id}")
    public BoardPost getPost(@PathVariable Long id) {
        return postRepository.findById(id).orElse(null);
    }
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
    }
    // 댓글 등록
    @PostMapping("/{postId}/replies")
    public Reply addReply(@PathVariable Long postId, @RequestBody Reply reply) {
        BoardPost post = postRepository.findById(postId).orElseThrow();
        reply.setPost(post);
        return replyRepository.save(reply);
    }
    // 댓글 조회
    @GetMapping("/{postId}/replies")
    public List<Reply> getReplies(@PathVariable Long postId) {
        return replyRepository.findByPostId(postId);
    }
    //댓글 수정
    @PutMapping("/{postId}/replies/{replyId}")
    public Reply updateReply(@PathVariable Long replyId, @RequestBody Reply updatedReply) {
        Reply reply = replyRepository.findById(replyId).orElseThrow();
        reply.setContent(updatedReply.getContent());
        return replyRepository.save(reply);
    }
    //댓글 삭제
    @DeleteMapping("/{postId}/replies/{replyId}")
    public void deleteReply(@PathVariable Long replyId) {
        replyRepository.deleteById(replyId);
    }

}
