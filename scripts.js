document.addEventListener('DOMContentLoaded', () => {
  const createPostLink = document.getElementById('create-post-link');
  const listPostsLink = document.getElementById('list-posts-link');
  const createPostSection = document.getElementById('create-post-section');
  const listPostsSection = document.getElementById('list-posts-section');
  const createPostForm = document.getElementById('create-post-form');
  const postsList = document.getElementById('posts-list');

  // Show create post form
  createPostLink.addEventListener('click', (e) => {
    e.preventDefault();
    createPostSection.classList.remove('hidden');
    listPostsSection.classList.add('hidden');
  });

  // Show list of posts
  listPostsLink.addEventListener('click', (e) => {
    e.preventDefault();
    createPostSection.classList.add('hidden');
    listPostsSection.classList.remove('hidden');
    fetchPosts();
  });

  // Handle create post form submission
  createPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value;

    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, author }),
      });
      const post = await response.json();
      console.log('Post created:', post);
      createPostForm.reset();
      alert('Post created successfully');
      fetchPosts();  // Refresh the posts list
    } catch (error) {
      console.error('Error creating post:', error);
    }
  });

  // Fetch and display posts
  async function fetchPosts() {
    try {
      const response = await fetch('http://localhost:3000/posts');
      const posts = await response.json();
      postsList.innerHTML = '';
      posts.forEach((post) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <p><em>By: ${post.author}</em></p>
          <button onclick="deletePost('${post._id}')">Delete</button>
        `;
        postsList.appendChild(postDiv);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  // Handle delete post
  window.deletePost = async function (id) {
    try {
      await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
      });
      fetchPosts();  // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  // Initial fetch of posts
  fetchPosts();
});
