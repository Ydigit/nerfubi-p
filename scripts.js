// This file contains JavaScript code for interactivity on the website. 
// It includes functions to handle user interactions, load images and videos, 
// and manage the interactive mesh display.

document.addEventListener('DOMContentLoaded', function() {
    // Function to load images dynamically
    function loadImages() {
        const imageContainer = document.getElementById('image-gallery');
        const images = ['model1.jpg', 'model2.jpg', 'model3.jpg']; // Add your image filenames here

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = `images/${image}`;
            imgElement.alt = `Image of ${image}`;
            imgElement.classList.add('model-image');
            imageContainer.appendChild(imgElement);
        });
    }

    // Function to load videos dynamically
    function loadVideos() {
        const videoContainer = document.getElementById('video-gallery');
        const videos = ['model1.mp4', 'model2.mp4', 'model3.mp4']; // Add your video filenames here

        videos.forEach(video => {
            const videoElement = document.createElement('video');
            videoElement.src = `videos/${video}`;
            videoElement.controls = true;
            videoElement.classList.add('model-video');
            videoContainer.appendChild(videoElement);
        });
    }

    // Function to initialize interactive mesh
    function initMesh() {
        const meshContainer = document.getElementById('mesh-container');
        // Placeholder for mesh initialization code
        // This could involve a library like Three.js or similar
        meshContainer.innerHTML = '<p>Interactive mesh will be displayed here.</p>';
    }

    // Load images, videos, and initialize mesh on page load
    loadImages();
    loadVideos();
    initMesh();
});