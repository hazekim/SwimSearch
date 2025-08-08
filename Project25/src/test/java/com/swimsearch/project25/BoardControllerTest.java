
package com.swimsearch.project25;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.is;


import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

@WebMvcTest(value = BoardController.class, excludeAutoConfiguration = {HibernateJpaAutoConfiguration.class, JpaRepositoriesAutoConfiguration.class})
class BoardControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private BoardPostRepository postRepository;

    @MockBean
    private ReplyRepository replyRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("게시글 전체 조회 테스트")
    void getPostsTest() throws Exception {
        // given (테스트 데이터 준비)
        BoardPost post1 = new BoardPost();
        post1.setTitle("테스트 제목 1");
        post1.setContent("테스트 내용 1");

        BoardPost post2 = new BoardPost();
        post2.setTitle("테스트 제목 2");
        post2.setContent("테스트 내용 2");

        List<BoardPost> posts = Arrays.asList(post1, post2);

        given(postRepository.findAll()).willReturn(posts);

        // when & then (실행 및 검증)
        mvc.perform(get("/api/board"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)))
                .andExpect(jsonPath("$[0].title", is("테스트 제목 1")))
                .andExpect(jsonPath("$[1].title", is("테스트 제목 2")));
    }

    @Test
    @DisplayName("게시글 생성 테스트")
    void createPostTest() throws Exception {
        // given (테스트 데이터 준비)
        BoardPost newPost = new BoardPost();
        newPost.setTitle("새 게시글 제목");
        newPost.setContent("새 게시글 내용");
        newPost.setAuthor("작성자");

        given(postRepository.save(any(BoardPost.class))).willReturn(newPost);

        // when & then (실행 및 검증)
        mvc.perform(post("/api/board")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newPost)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("새 게시글 제목")))
                .andExpect(jsonPath("$.content", is("새 게시글 내용")))
                .andExpect(jsonPath("$.author", is("작성자")));
    }
}
