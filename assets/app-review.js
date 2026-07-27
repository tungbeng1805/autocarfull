var pageIndex = 0;
var base_img = 'https://api.autocaruniverse.cloud/uploads/images/'
var base_video = 'https://api.autocaruniverse.cloud/uploads/videos/'
var reviews;

document.addEventListener('DOMContentLoaded', function() {
    getVideo();
    getImage();
    getData(pageIndex, false);
    
    initDragScroll();
    setTimeout(() => {
        addEventListenerBtn();
    }, 3000);
});

function getVideo() {
    fetch(`https://api.autocaruniverse.cloud/api/media/files?type=videos&pageIndex=0&pageSize=10`)
        .then(response => response.json())
        .then(data => {
            const videos = data?.data;
            const videoContainer = document.getElementById('videoContainer');
            if (videoContainer && Array.isArray(videos)) {
                videoContainer.innerHTML = '';

                videos.forEach((video, idx) => {
                    const thumbnail = `${base_video}${video.filename}`;
                    const postterImg = `${base_img}${video.frame}`;


                    const videoItem = document.createElement('div');
                    videoItem.className = 'video-item-app-review';

                    videoItem.addEventListener('click', () => showModalvideo(videos, idx));

                    videoItem.innerHTML = `
                        <div class="video-thumbnail-app-review">
                            <video 
                                src="${thumbnail}" 
                                controls 
                                width="180" 
                                height="120" 
                                poster="${postterImg}" 
                                style="border-radius: 8px; background: #000;"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div class="video-rating-app-review">
                            <div class="stars-app-review">
                                ${[...Array(5)].map(() => '<div class="star-app-review"></div>').join('')}
                            </div>
                        </div>
                    `;

                    videoContainer.appendChild(videoItem);
                });
            }
        })
        .catch(error => {
            console.error('Error loading videos:', error);
        });
}


function getImage() {
    fetch(`https://api.autocaruniverse.cloud/api/media/files?type=images&pageIndex=0&pageSize=10`)
        .then(response => response.json())
        .then(data => {
            const images = data?.data;
            const imageContainer = document.getElementById('imageContainer');
            if (imageContainer && Array.isArray(images)) {
                imageContainer.innerHTML = '';
                
                images.forEach((image, idx) => {
                    const imgSrc = `${base_img}${image.filename}`;
                    const imgEl = document.createElement('img');
                    imgEl.src = imgSrc;
                    imgEl.alt = `Review image ${idx + 1}`;
                    imgEl.width = 160;
                    imgEl.height = 160;

                    imgEl.addEventListener('click', () => {
                        getImageDetail(image.reviewId);
                    });

                    const wrapper = document.createElement('div');
                    wrapper.className = 'image-item-app-review';
                    wrapper.appendChild(imgEl);

                    imageContainer.appendChild(wrapper);
                });
            }
        });
}

function getImageDetail(id) {
    fetch(`https://api.autocaruniverse.cloud/api/media/files?type=images&isFull=true`)
        .then(response => response.json())
        .then(data => {
            const images = data.data;

            const modal = document.getElementById('reviewModal');
            const modalContent = document.getElementById('modalContent');
            const modalContentApp = document.getElementsByClassName('modal-content-app-review')[0];
            if (modalContentApp) {
                modalContentApp.classList.add('modal-image-app-review');
            }

            modalContent.innerHTML = `
                <div class="review-modal-app-review">
                    <div class="modal-topbar-app-review" onclick="(function(){document.getElementById('reviewModal').style.display='none'})()">
                        <button class="back-btn-app-review" aria-label="Back" >
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <span class="topbar-title-app-review">Review Images</span>
                    </div>
                    <div class="review-images-app-review"></div>
                </div>
            `;

            const container = modalContent.querySelector('.review-images-app-review');

            images.forEach((image, i) => {
                const imgEl = document.createElement('img');
                imgEl.src = `${base_img}${image.filename}`;
                imgEl.alt = `thumb ${i + 1}`;
                imgEl.dataset.index = i;

                imgEl.addEventListener('click', () => {
                    showModalImagesDetail(image.reviewId)
                });

                container.appendChild(imgEl);
            });

            modal.style.display = 'block';

            const closeBtn = document.querySelector('.close-app-review');
            closeBtn.onclick = function() {
                modal.style.display = 'none';
                modalContentApp.classList.remove('modal-image-app-review');
            };

            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                    modalContentApp.classList.remove('modal-image-app-review');
                }
            };
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
}

function showModalImagesDetail(id) {
    fetch(`https://api.autocaruniverse.cloud/api/reviews/${id}`)
        .then(response => response.json())
        .then(data => {
            const review = data.data
            showModalDetail(review)
    })
}


function getData(pageIndex, isShowMore) {
    fetch(`https://api.autocaruniverse.cloud/api/reviews?pageIndex=${pageIndex}&pageSize=8`)
        .then(response => response.json())
        .then(data => {
            reviews = data.data.reviews;
            const indexS = isShowMore ? 1 : 0;
            const reviewContainer = document.getElementsByClassName('customer-review-app-review')[indexS];
            reviews.forEach((review, index) => {
                // Tạo HTML review card
                const reviewHTML = `
                    <div class="review-card-app-review" data-review-id="${review.id}" data-top-review="${index == 0 ? 1 : 0}">
                        <h2 class="review-title-app-review">${review.title}</h2>
                        <div class="review-meta-app-review">
                            <div class="stars-app-review" style="margin-right: 10px;">
                                ${[...Array(review.rate)].map(() => '<div class="star-app-review"></div>').join('')}
                                ${[...Array(5 - review.rate)].map(() => `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <polygon 
                                            points="12,2 14.09,8.26 20.18,8.27 15,12.14 17.18,18.02 12,14.27 6.82,18.02 9,12.14 3.82,8.27 9.91,8.26"
                                            fill="white"
                                            stroke="#fde047"
                                            stroke-width="1.5"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                `).join('')}
                            </div>
                            <span class="review-date-app-review">
                                ${(() => {
                                    const now = new Date();
                                    const pastYear = new Date();
                                    pastYear.setFullYear(now.getFullYear() - 1);

                                    // Tạo timestamp ngẫu nhiên giữa pastYear và now
                                    const randomTime = pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime());
                                    const randomDate = new Date(randomTime);

                                    return randomDate.toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                    });
                                })()}
                                </span>

                        </div>
                        <div class="review-meta-app-review">
                            ${review.verified_purchase !== 0 ? `<span class="badge-app-review verified-app-review">Verified Purchase</span>` : ''}
                            ${review.would_recommend !== 0 ? `<span class="badge-app-review recommend-app-review"><i class="fas fa-check-circle"></i> Would recommend</span>` : ''}
                        </div>
                        <div class="review-content-app-review">
                            <p>${review.description ?? ''}</p>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <div class="review-author-app-review">${review.user}</div>
                            <div class="review-actions-app-review">
                                <div class="like-icon-app-review">
                                    <i class="far fa-thumbs-up"></i>
                                    <span>Helpful</span> <span class="count-app-review" id="likeCount-${review.id}">(${review.likes ?? 0})</span>
                                </div>
                            </div>
                        </div>
                        <div class="review-gallery-app-review">
                            ${review.images.map((image, i) => `
                                <img 
                                    class="review-img-app-review" 
                                    data-review-id="${review.id}" 
                                    data-index="${i}" 
                                    src="${base_img}${image.filename}" 
                                    alt="Review photo ${i+1}" 
                                    width="160px" 
                                    height="160px"
                                >
                            `).join('')}
                        </div>
                    </div>
                `;

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = reviewHTML;

                reviewContainer.appendChild(tempDiv.firstElementChild);
            });
            getTopReiew();
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });
}

function getMoreReview() {
    pageIndex++;
    getData(pageIndex + 1, true);
}

window.getMoreReview = getMoreReview;

function showModalvideo(videos, startIndex) {
    let currentIndex = startIndex;

    const modal = document.getElementById('reviewModal');
    const modalContent = document.getElementById('modalContent');
    const modalContentWrapper = modalContent.closest('.modal-content-app-review');
    if (modalContentWrapper) {
        modalContentWrapper.style.maxWidth = '800px';
    }

    function pauseAllOutsideVideos() {
        document.querySelectorAll('#videoContainer video').forEach(v => {
            v.pause();
            v.currentTime = 0;
        });
    }

    function renderVideo(index) {
        pauseAllOutsideVideos();
        const videoSrc = `${base_video}${videos[index].filename}`;
        modalContent.innerHTML = `
            <div class="review-modal-app-review">
                <div class="modal-topbar-app-review">
                    <button class="back-btn-app-review" aria-label="Back" onclick="(function(){document.getElementById('reviewModal').style.display='none'})()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <span class="topbar-title-app-review">Video</span>
                </div>
                <div style="padding: 0px">
                    <div class="modal-media-app-review">
                        <div class="media-viewer-app-review" style="position: relative;">
                            <video id="modalMainVideo" src="${videoSrc}" controls autoplay style="width: 100%; height: 520px; object-fit: contain; background: #000; display: block;"></video>
                            <button class="media-nav-app-review prev-app-review" id="mediaPrev" style="position:absolute;top:50%;left:10px;transform:translateY(-50%)">
                                <i class="fas fa-chevron-left" style="font-size: 45px; color: white;"></i>
                            </button>
                            <button class="media-nav-app-review next-app-review" id="mediaNext" style="position:absolute;top:50%;right:10px;transform:translateY(-50%)">
                                <i class="fas fa-chevron-right" style="font-size: 45px; color: white;"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // prev / next
        const prevBtn = document.getElementById('mediaPrev');
        const nextBtn = document.getElementById('mediaNext');

        if (prevBtn) {
            prevBtn.onclick = () => {
                currentIndex = (currentIndex - 1 + videos.length) % videos.length;
                renderVideo(currentIndex);
            };
        }
        if (nextBtn) {
            nextBtn.onclick = () => {
                currentIndex = (currentIndex + 1) % videos.length;
                renderVideo(currentIndex);
            };
        }
    }

    modal.style.display = 'block';
    renderVideo(currentIndex);

    // đóng modal
    const closeBtn = document.querySelector('.close-app-review');
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            if (modalContentWrapper) modalContentWrapper.style.maxWidth = '1280px';
        };
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            if (modalContentWrapper) modalContentWrapper.style.maxWidth = '1280px';
        }
    };

    const handleEsc = function(e) {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            if (modalContentWrapper) modalContentWrapper.style.maxWidth = '1280px';
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}


function showModalDetail(review) {
    const modal = document.getElementById('reviewModal');
    const modalContent = document.getElementById('modalContent');
    const modalContentApp = document.getElementsByClassName('modal-content-app-review')[0];
    if (modalContentApp) {
        modalContentApp.classList.add('modal-image-app-review');
        modalContentApp.classList.add('modal-image-details-app-review');
    }
    
    modalContent.innerHTML = `
        <div class="review-modal-app-review">
            <div class="modal-topbar-app-review" onclick="(function(){document.getElementById('reviewModal').style.display='none'})()">
                <button class="back-btn-app-review" aria-label="Back" >
                    <i class="fas fa-arrow-left"></i>
                </button>
                <span class="topbar-title-app-review">All Photos</span>
            </div>
            <div class="review-modal-body-app-review">
                <div class="modal-media-app-review">
                    <div class="media-viewer-app-review">
                        <img id="modalMainImg" src="${base_img}${review.images[0]?.filename}" alt="review image">
                        <button class="media-nav-app-review prev-app-review" id="mediaPrev"><i class="fas fa-chevron-left" style="font-size: 45px; color: white;"></i></button>
                        <button class="media-nav-app-review next-app-review" id="mediaNext"><i class="fas fa-chevron-right" style="font-size: 45px; color: white;"></i></button>
                    </div>
                </div>
                <div class="modal-details-app-review">
                    <div class="detail-title-app-review">${review.title}</div>
                    <div class="detail-meta-line-app-review">
                        <div class="stars-app-review">
                        ${[...Array(review.rate)].map(() => '<div class="star-app-review"></div>').join('')}
                        ${[...Array(5 - review.rate)].map(() => `
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <polygon 
                                    points="12,2 14.09,8.26 20.18,8.27 15,12.14 17.18,18.02 12,14.27 6.82,18.02 9,12.14 3.82,8.27 9.91,8.26"
                                    fill="white"
                                    stroke="#fde047"
                                    stroke-width="1.5"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        `).join('')}
                        </div>
                        <span class="review-date-app-review">
                        ${(() => {
                            const now = new Date();
                            const pastYear = new Date();
                            pastYear.setFullYear(now.getFullYear() - 1);

                            // Tạo timestamp ngẫu nhiên giữa pastYear và now
                            const randomTime = pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime());
                            const randomDate = new Date(randomTime);

                            return randomDate.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                            });
                        })()}
                        </span>

                        
                    </div>
                    <div class="detail-meta-line-app-review">
                        ${review.verified_purchase !== 0 ? `<span class="badge-app-review verified-app-review">Verified Purchase</span>` : ''}
                        ${review.would_recommend !== 0 ? `<span class="badge-app-review recommend-app-review"><i class="fas fa-check-circle"></i> Would recommend</span>` : ''}
                    </div>
                    <div class="detail-text-app-review">${review.description}</div>
                    <div class="detail-footer-app-review">
                        <div class="author-app-review">${review.user}</div>
                        <div class="helpful-app-review"><i class="far fa-thumbs-up"></i> Helpful <span class="count-app-review">(${review.likes ?? 0})</span></div>
                    </div>
                </div>
                <div class="media-thumbs-app-review" id="mediaThumbs">
                    ${review.images.map((image, i) => `
                        <img data-index="${i}" class="${i===0 ? 'active-app-review' : ''}" src="${base_img}${image.filename}" alt="thumb ${i+1}">
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';

    const helpfulBtn = modalContent.querySelector('.helpful-app-review');
    helpfulBtn.addEventListener('click', function () {
        const likeCountEl = helpfulBtn.querySelector('.count-app-review');
        let currentRate = parseInt(likeCountEl.textContent.replace(/[()]/g, ''), 10) || 0;
        if (helpfulBtn.getAttribute('data-liked') === 'true') {
            currentRate -= 1;
            likeCountEl.textContent = `(${currentRate})`;
            helpfulBtn.setAttribute('data-liked', 'false');
            return;
        };

        currentRate += 1;
        likeCountEl.textContent = `(${currentRate})`;
        helpfulBtn.setAttribute('data-liked', 'true');
    });
    
    const closeBtn = document.querySelector('.close-app-review');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        modalContentApp.classList.remove('modal-image-app-review');
        modalContentApp.classList.remove('modal-image-details-app-review');
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            modalContentApp.classList.remove('modal-image-app-review');
            modalContentApp.classList.remove('modal-image-details-app-review');
        }
    }

    let currentIndex = 0;
    const mainImg = document.getElementById('modalMainImg');
    const prevBtn = document.getElementById('mediaPrev');
    const nextBtn = document.getElementById('mediaNext');
    const thumbsWrap = document.getElementById('mediaThumbs');
    const thumbs = thumbsWrap ? Array.from(thumbsWrap.querySelectorAll('img')) : [];
    const totalImages = Array.isArray(review.images) ? review.images.length : 0;

    function updateNavDisabled() {
        const disabled = totalImages <= 1;
        if (prevBtn) prevBtn.disabled = disabled;
        if (nextBtn) nextBtn.disabled = disabled;
    }

    function setActive(index) {
        if (!totalImages || !mainImg) return;
        currentIndex = (index + totalImages) % totalImages;
        mainImg.src = `${base_img}${review.images[currentIndex]?.filename}`;
        thumbs.forEach((t, i) => {
            if (i === currentIndex) t.classList.add('active-app-review');
            else t.classList.remove('active-app-review');
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => setActive(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => setActive(currentIndex + 1));
    thumbs.forEach(t => t.addEventListener('click', () => setActive(parseInt(t.getAttribute('data-index'), 10))));

    setActive(0);
    updateNavDisabled();

    function handleKey(e){
        if (modal.style.display !== 'block') return;
        if (e.key === 'ArrowLeft') setActive(currentIndex - 1);
        if (e.key === 'ArrowRight') setActive(currentIndex + 1);
        if (e.key === 'Escape') modal.style.display = 'none';
    }
    document.addEventListener('keydown', handleKey, { once: false });
}

function initDragScroll() {
    const containers = document.querySelectorAll('.video-reviews-app-review, .image-reviews-app-review');
    
    containers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Tốc độ scroll
            container.scrollLeft = scrollLeft - walk;
        });
    });
}

function openImageLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-app-review';
    lightbox.innerHTML = `
        <div class="lightbox-content-app-review">
            <span class="lightbox-close-app-review">&times;</span>
            <img src="${imageSrc}" alt="Full size image">
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    const closeLightbox = () => {
        document.body.removeChild(lightbox);
    };
    
    lightbox.querySelector('.lightbox-close-app-review').onclick = closeLightbox;
    lightbox.onclick = (e) => {
        if (e.target === lightbox) closeLightbox();
    };
}

function getTopReiew() {
  const reviewEl  = document.querySelector('.review-card-app-review[data-top-review="1"]');
  const container = document.querySelector('.top-review .customer-review-app-review-top-review');
  container.classList.add('customer-review-app-review');
  if (!reviewEl || !container) return;

  // Xóa toàn bộ con trong container (chỉ phạm vi top-review)
  if (container.replaceChildren) {
    container.replaceChildren();
  } else {
    while (container.firstChild) container.removeChild(container.firstChild);
  }

  // Di chuyển hẳn node qua (giữ nguyên mọi event listener đã gắn)
  container.appendChild(reviewEl);
}

function addEventListenerBtn() {
    const reviewContainerAll = document.querySelectorAll('.customer-review-app-review');

    reviewContainerAll.forEach(_reviewContainer => {
        _reviewContainer.addEventListener('click', function(e) {
            const img = e.target.closest('.review-img-app-review');
            if (!img) return;

            const reviewId = img.getAttribute('data-review-id');
            const review = reviews.find(r => r.id == reviewId);
            if (review) {
                showModalDetail(review);
            }
        });

        _reviewContainer.addEventListener('click', function(e) {
        const likeIcon = e.target.closest('.like-icon-app-review');
        if (!likeIcon) return;

        const reviewCard = likeIcon.closest('.review-card-app-review');
        if (!reviewCard) return;

        const likeCountEl = reviewCard.querySelector('.count-app-review');
        if (!likeCountEl) return;

        let currentRate = parseInt(likeCountEl.textContent.replace(/[()]/g, ''), 10) || 0;

        if (likeIcon.getAttribute('data-liked') === 'true') {
            likeCountEl.textContent = `(${currentRate - 1})`;
            likeIcon.setAttribute('data-liked', 'false');
            return;
        }

        likeIcon.setAttribute('data-liked', 'true');

        currentRate += 1;
        likeCountEl.textContent = `(${currentRate})`;
    });
    });
}

function setActiveReviewBar() {
    const reviewToolBar = document.getElementById('review-tool-bar');
    if (reviewToolBar) {
        reviewToolBar.click();
    }
}

// Bắt sự kiện click
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.btn-view-all-top-comment');
    if (btn) {
        btn.addEventListener('click', function () {
            setActiveReviewBar();
        });
    }
});





