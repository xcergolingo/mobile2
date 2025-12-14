document.addEventListener('DOMContentLoaded', function() {
    // Get all video containers
    const videoContainers = document.querySelectorAll('.feature-video-container');
    
    videoContainers.forEach(container => {
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Get all videos in this container
        const videos = container.querySelectorAll('video');
        let currentVideoIndex = 0;
        
        // Initially show first video and hide others
        videos.forEach((video, index) => {
            if (index !== 0) {
                video.style.display = 'none';
            }
        });
        
        // Add touch event listeners to the wrapper
        const wrapper = container.querySelector('.wrapper');
        
        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        wrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        // Add click event listeners to navigation buttons
        const sliderNav = container.querySelector('.slider-nav');
        if (sliderNav) {
            const navButtons = sliderNav.querySelectorAll('a');
            navButtons.forEach((button, index) => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    showVideo(index);
                });
            });
        }
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swiped right - go to previous video
                    if (currentVideoIndex > 0) {
                        showVideo(currentVideoIndex - 1);
                    }
                } else {
                    // Swiped left - go to next video
                    if (currentVideoIndex < videos.length - 1) {
                        showVideo(currentVideoIndex + 1);
                    }
                }
            }
        }
        
        function showVideo(index) {
            // Hide current video
            videos[currentVideoIndex].style.display = 'none';
            // Show new video
            videos[index].style.display = 'block';
            // Update current index
            currentVideoIndex = index;
            
            // Update slider-nav indicators
            const sliderNav = container.querySelector('.slider-nav');
            if (sliderNav) {
                const indicators = sliderNav.querySelectorAll('a');
                indicators.forEach((indicator, i) => {
                    if (i === index) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
            }
        }
    });

    // Create Intersection Observer for videos
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            if (entry.isIntersecting) {
                // Video is in viewport
                if (video.paused) {
                    video.play().catch(error => {
                        // Handle autoplay restrictions
                        console.log('Autoplay prevented:', error);
                    });
                }
            } else {
                // Video is out of viewport
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, {
        root: null, // Use viewport as root
        rootMargin: '0px',
        threshold: 0.5 // Video must be at least 50% visible
    });

    // Observe all videos
    document.querySelectorAll('video').forEach(video => {
        videoObserver.observe(video);
    });
});



// Code to automatically play or pause videos based on viewport visibility
// Function to check if an element is in viewport
funct