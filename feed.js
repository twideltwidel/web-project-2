// Edan-Shapira-322533084-Roy-Ohayon-211451661

const allPosts = [];

document.addEventListener('DOMContentLoaded', () => {
  const postFeed = document.getElementById('postFeed');
  const postTemplate = document.getElementById('postTemplate');
  const newPostText = document.getElementById('newPostText');
  const addPostBtn = document.getElementById('addPostBtn');
  const imageInput = document.getElementById('imageInput');
  const imageUploadBtn = document.getElementById('imageUploadBtn');
  const postDetail = document.getElementById('postDetail');
  let selectedImageData = '';
  let scrollBtn = document.getElementById("scroll-btn");

  scrollBtn.addEventListener("click", topFunction);
  window.onscroll = function() { scrollFunction(); };

  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => { // theme button function
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  function scrollFunction() { // back to top button function
    if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
      scrollBtn.style.display = "block";
    } else {
      scrollBtn.style.display = "none";
    }
  }
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }

  imageUploadBtn.addEventListener('click', () => {
    imageInput.click();
  });

  imageInput.addEventListener('change', () => { // image upload function
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        selectedImageData = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // starting posts
  const starterPosts = [
    {
      id: generateId(),
      name: 'ILOVECATS',
      handle: '@catlover69',
      pfp: 'icons/g1.png',
      text: 'I HECKING LOVE CATS!!!! #CATSARELOVECATSARELIFE',
      image: 'icons/cati.png',
      comments: [],
      retweets: 3,
      likes: 8,
      engagements: 12,
      liked: false
    },
    {
      id: generateId(),
      name: 'master of cats',
      handle: '@catlober420',
      pfp: 'icons/g2.png',
      text: '@catlover69 is a scam and a fraud. if he really likes cats he would post a real cat and not this ugly cartoon cat, i wouldnt be surprised if he had a pro-dog propaganda account. i only post real cats.',
      image: 'icons/catr.png',
      comments: [],
      retweets: 1,
      likes: 4,
      engagements: 5,
      liked: false
    }
  ];

  starterPosts.forEach((post, i) => {
    allPosts.push(post);
    renderPost(post, false, i);
  });

  addPostBtn.addEventListener('click', () => { // new post button function
    const text = newPostText.value.trim();
    if (text === '') return;

    const postData = {
      id: generateId(),
      name: 'truth seeker',
      handle: '@born2grift',
      pfp: 'icons/pfp.png',
      text: text,
      image: selectedImageData,
      comments: [],
      retweets: 0,
      likes: 0,
      engagements: 0,
      liked: false
    };

    const index = allPosts.push(postData) - 1;
    renderPost(postData, true, index);
    const newPost = postFeed.firstElementChild;
    selectedImageData = '';
    imageInput.value = '';
    newPost.classList.add('highlight'); // makes the new post highlighted and then removes the highlight
    newPost.addEventListener('animationend', () => { 
      newPost.classList.remove('highlight');
    }, { once: true });

    newPostText.value = '';
  });

  function renderPost(data, prepend = false, index = null) { // builds posts in the feed
    const clone = postTemplate.content.cloneNode(true);

    clone.querySelector('.post').dataset.id = data.id;

    clone.querySelector('.pfp').src = data.pfp;
    clone.querySelector('.name').textContent = data.name;
    clone.querySelector('.handle').textContent = data.handle;
    const postTextElement = clone.querySelector('.post-text');
    postTextElement.innerHTML = formatPostText(data.text);

    const postImg = clone.querySelector('.post-img');
    if (data.image) {
      postImg.src = data.image;
      postImg.classList.remove('hidden');
    } else {
      postImg.classList.add('hidden');
    }

    clone.querySelector('.comment-count').textContent = data.comments.length || 0;
    clone.querySelector('.retweet-count').textContent = data.retweets;
    clone.querySelector('.like-count').textContent = data.likes;
    clone.querySelector('.engage-count').textContent = data.engagements;

    const likeBtn = clone.querySelector('.like-btn');
    const likeCountSpan = clone.querySelector('.like-count');

    if (data.liked) { // makes it so you can only like a post once
      likeBtn.disabled = true;
      likeBtn.dataset.liked = 'true';
      likeBtn.classList.add('liked');
    } else {
      likeBtn.dataset.liked = 'false';
      likeBtn.classList.remove('liked');
    }

    likeBtn.addEventListener('click', () => {
      handleLike(data, likeBtn, likeCountSpan);
    });

    const commentBtn = clone.querySelector('.comment-btn');
    commentBtn.addEventListener('click', () => { // comment button function to change view type
      showPostDetailView(data, index);
    });

    const deleteBtn = clone.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => { // delete button function
      const postId = data.id;
      const postIndex = allPosts.findIndex(p => p.id === postId);

      if (postIndex !== -1) {
        allPosts.splice(postIndex, 1);
        const postElement = document.querySelector(`.post[data-id="${postId}"]`);
        if (postElement) postElement.remove();
      }
    });

    if (prepend) { // if the post is new it will be added to the top of the feed
      postFeed.prepend(clone);
    } else {
      postFeed.appendChild(clone);
    }
  }

  function showPostDetailView(postData, index) { // changes the view to post detail view for comments/replies
    document.getElementById('newPostBox').classList.add('hidden');
    postFeed.classList.add('hidden');
    postDetail.classList.remove('hidden');
    postDetail.innerHTML = '';

    const backButton = document.createElement('button');
    backButton.textContent = '← Post';
    backButton.className = 'back-button';
    backButton.addEventListener('click', () => { // goes back to the normal feed view
      document.getElementById('newPostBox').classList.remove('hidden');
      postDetail.classList.add('hidden');
      postFeed.classList.remove('hidden');

      // Refresh the original post DOM (update like button & count)
      const idx = allPosts.indexOf(postData);
      if (idx !== -1) {
        const feedPost = document.querySelector(`.post[data-id="${postData.id}"]`);
        if (feedPost) {
          const likeBtn = feedPost.querySelector('.like-btn');
          const likeCount = feedPost.querySelector('.like-count');
          likeCount.textContent = postData.likes;
          if (postData.liked) {
            likeBtn.disabled = true;
            likeBtn.classList.add('liked');
          } else {
            likeBtn.disabled = false;
            likeBtn.classList.remove('liked');
          }
        }
      }
    });

    postDetail.appendChild(backButton);

    //  build the main post in the detail view
    const mainPost = createPostElement(postData, true);
    postDetail.appendChild(mainPost);

    
    const replyBox = document.createElement('div'); // creates the reply box in the post detail view
    replyBox.className = 'reply-box-container';
    replyBox.innerHTML = `
      <textarea id="replyText" class="form-control reply-box post-textarea" placeholder="Post your reply..."></textarea>
      <div class="post-buttons">
        <input type="file" id="imageInput" accept="image/*" style="display: none;">
        <button id="imageUploadBtn"></button>
        <button id="submitReply" class="btn reply-button submit-reply">Reply</button>
      </div>
    `;
    postDetail.appendChild(replyBox);

    // img upload for reply box
    const detailImageInput = replyBox.querySelector('#imageInput');
    const detailImageUploadBtn = replyBox.querySelector('#imageUploadBtn');

    detailImageUploadBtn.addEventListener('click', () => {
      detailImageInput.click();
    });

    detailImageInput.addEventListener('change', () => {
      const file = detailImageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          selectedImageData = reader.result;
        };
        reader.readAsDataURL(file);
      }
    });

    replyBox.querySelector('.submit-reply').addEventListener('click', () => { // reply button function
      const text = document.getElementById('replyText').value.trim();
      if (text === '') return;

      const replyPost = {
        name: 'You',
        handle: '@you',
        pfp: 'icons/pfp.png',
        text: text,
        image: selectedImageData,
        comments: [],
        retweets: 0,
        likes: 0,
        engagements: 0,
        liked: false
      };

      postData.comments.unshift(replyPost);

      renderCommentList(postData.comments, 0, postData);

      // update comment count for main feed
      const feedPost = document.querySelector(`.post[data-id="${postData.id}"]`);
      if (feedPost) {
        const commentCount = feedPost.querySelector('.comment-count');
        if (commentCount) {
          commentCount.textContent = postData.comments.length;
        }
      }

      // update comment count in detail view
      const detailMainPost = postDetail.querySelector('.post');
      if (detailMainPost) {
        const commentCount = detailMainPost.querySelector('.comment-count');
        if (commentCount) {
          commentCount.textContent = postData.comments.length;
        }
      }

      selectedImageData = '';
      detailImageInput.value = '';
      document.getElementById('replyText').value = '';
    });

    // comment list
    const commentContainer = document.createElement('div');
    commentContainer.id = 'commentList';
    postDetail.appendChild(commentContainer);
    renderCommentList(postData.comments, null, postData);
  }

  function createPostElement(postData, hideDeleteBtn = false, parentPost = null, commentIndex = null) { // build new post mostly the same as renderPost function
    const clone = postTemplate.content.cloneNode(true);
    clone.querySelector('.pfp').src = postData.pfp;
    clone.querySelector('.name').textContent = postData.name;
    clone.querySelector('.handle').textContent = postData.handle;
    clone.querySelector('.post-text').innerHTML = formatPostText(postData.text);

    const postImg = clone.querySelector('.post-img');
    if (postData.image) {
      postImg.src = postData.image;
      postImg.classList.remove('hidden');
    } else {
      postImg.classList.add('hidden');
    }

    clone.querySelector('.comment-count').textContent = postData.comments.length || 0;
    clone.querySelector('.retweet-count').textContent = postData.retweets;
    clone.querySelector('.like-count').textContent = postData.likes;
    clone.querySelector('.engage-count').textContent = postData.engagements;

    const likeBtn = clone.querySelector('.like-btn');
    const likeCountSpan = clone.querySelector('.like-count');

    if (postData.liked) {
      likeBtn.disabled = true;
      likeBtn.dataset.liked = 'true';
      likeBtn.classList.add('liked');
    } else {
      likeBtn.dataset.liked = 'false';
      likeBtn.classList.remove('liked');
    }

    likeBtn.addEventListener('click', () => {
      handleLike(postData, likeBtn, likeCountSpan);
    });

    // hides delete button in detailed view(wont make sense to delete the main post there)
    const deleteBtn = clone.querySelector('.delete-btn');
    if (hideDeleteBtn) {
      if (deleteBtn) deleteBtn.style.display = 'none';
    } else if (parentPost && typeof commentIndex === 'number') {
      // delete button for comments logic
      deleteBtn.addEventListener('click', () => {
        parentPost.comments.splice(commentIndex, 1);
        renderCommentList(parentPost.comments, null, parentPost);
      });
    }

    return clone;
  }

  function renderCommentList(comments, highlightIndex = null, parentPost = null) { // builds the comment list in the post detailview
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = '';

    comments.forEach((comment, i) => {
      const commentElement = createPostElement(comment, false, parentPost, i);

      if (i === highlightIndex) {
        const post = commentElement.querySelector('.post');
        post.classList.add('highlight');
        post.addEventListener('animationend', () => {
          post.classList.remove('highlight');
        }, { once: true });
      }

      commentList.appendChild(commentElement);
    });
  }

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => { // search function
    const query = searchInput.value.toLowerCase();
    const posts = postFeed.querySelectorAll('.post');
    posts.forEach(post => {
      const textContent = post.querySelector('.post-text').textContent.toLowerCase();
      post.style.display = textContent.includes(query) ? 'block' : 'none';
    });
  });
  const popup = document.createElement('div'); // creates the share popup
  popup.id = 'sharePopup';
  popup.className = 'share-popup';
  popup.style.display = 'none';
  popup.innerHTML = `
    <button class="share-option">Copy Link</button>
    <button class="share-option">Share post via...</button>
    <button class="share-option">Send via Direct Message</button>
    <button class="share-option">Post Video</button>
    <button class="share-option">Download video</button>
  `;
  document.body.appendChild(popup);

  // hide popup when clicking elsewhere instead of X button
  document.addEventListener('click', function (e) {
    if (!popup.contains(e.target) && !e.target.classList.contains('share-btn')) {
      popup.style.display = 'none';
    }
  });

  // adds the share button to each post
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('share-btn')) {
      e.stopPropagation();
      const rect = e.target.getBoundingClientRect(); // gets post position for popup positioning
      popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
      popup.style.display = 'flex';
    }
  });

  function formatPostText(text) { // add hashtags and mentions formatting for new posts using regex
    return text.replace(/([#@][\w\-]+)/g, match => {
      return `<span class="mention-hashtag">${match}</span>`;
    });
  }
});

function handleLike(postData, likeBtn, likeCountSpan) { // like button function
  if (postData.liked) return;

  postData.likes += 1;
  postData.liked = true;
  likeCountSpan.textContent = postData.likes;

  likeBtn.disabled = true;
  likeBtn.classList.add('pop-animation');
  likeBtn.addEventListener('animationend', () => {
    likeBtn.classList.remove('pop-animation');
  }, { once: true });
}

function generateId() { // generates a unique ID for each post to send to functions to apply functions on specific posts
  return '_' + Math.random().toString(36).substr(2, 9);
}

