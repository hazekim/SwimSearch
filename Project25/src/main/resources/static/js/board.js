// 글 등록
document.getElementById('postForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    fetch('/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    })
        .then(() => {
            document.getElementById('title').value = '';
            document.getElementById('content').value = '';
            loadPosts();
        });
});

// 글 목록 불러오기
function loadPosts() {
    fetch('/api/board')
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#postList tbody');
            tbody.innerHTML = '';

            data.forEach(post => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${post.id}</td>
                    <td><span style="cursor: pointer;" onclick="showDetail(${post.id})">${post.title}</span></td>
                    <td>${post.content}</td>
                    <td>
                        <button onclick="deletePost(${post.id})">Delete</button>
                        <button onclick="showReplySection(${post.id})">Reply</button> 
                    </td>`;
                tbody.appendChild(row);
            });
        });
}

//게시글 삭제
function deletePost(id) {
    if (!confirm("Do you really want to delete this post?")) return;

    fetch(`/api/board/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                alert('Post deleted');
                loadPosts();
            } else {
                alert('Failed to delete post');
            }
        });
}
// 상세보기 + 댓글 같이 표시
function showDetail(postId) {
    fetch(`/api/board/${postId}`)
        .then(res => res.json())
        .then(post => {
            document.getElementById('postDetailTitle').textContent = post.title;
            document.getElementById('postDetailContent').textContent = post.content;
            document.getElementById('postDetail').style.display = 'block';

            window.currentPostId = postId;
            loadReplies(postId);
        });
}

// 댓글 불러오기
function loadReplies(postId) {
    fetch(`/api/board/${postId}/replies`)
        .then(res => res.json())
        .then(data => {
            const replyList = document.getElementById('replyList');
            replyList.innerHTML = '';
            data.forEach(reply => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${reply.content}
                    <button onclick="showEditReply(${reply.id}, \`${reply.content}\`)">Edit</button>
                    <button onclick="deleteReply(${postId}, ${reply.id})">Delete</button>
                `;
                replyList.appendChild(li);
            });
        });
}

// 댓글 등록
document.getElementById('replySubmitBtn').addEventListener('click', () => {
    const content = document.getElementById('replyContent').value.trim();
    if (!content) {
        alert('Please enter a reply');
        return;
    }
    const postId = window.currentPostId;
    if (!postId) return;

    fetch(`/api/board/${postId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    })
        .then(() => {
            document.getElementById('replyContent').value = '';
            loadReplies(postId);
        });
});

// 댓글 취소
document.getElementById('replyCancelBtn').addEventListener('click', () => {
    document.getElementById('postDetail').style.display = 'none';
    window.currentPostId = null;
});

// 댓글 수정
function showEditReply(replyId, oldContent) {
    const newContent = prompt("Edit your reply:", oldContent);
    if (newContent === null) return;

    fetch(`/api/board/${window.currentPostId}/replies/${replyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
    }).then(() => {
        loadReplies(window.currentPostId);
    });
}

// 댓글 삭제
function deleteReply(postId, replyId) {
    if (!confirm("Delete this reply?")) return;

    fetch(`/api/board/${postId}/replies/${replyId}`, {
        method: 'DELETE'
    }).then(() => {
        loadReplies(postId);
    });
}

// 글 목록 불러오기 (상세보기 연결)
function loadPosts() {
    fetch('/api/board')
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#postList tbody');
            tbody.innerHTML = '';

            data.forEach(post => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${post.id}</td>
                    <td><span style="cursor: pointer; color: blue;" onclick="showDetail(${post.id})">${post.title}</span></td>
                    <td>${post.content}</td>
                    <td>
                        <button onclick="deletePost(${post.id})">Delete</button>
                    </td>`;
                tbody.appendChild(row);
            });
        });
}
//초기 로딩
loadPosts();
