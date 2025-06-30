/** @file
 *  @brief Visualization script for NeRFUBI project using Three.js
 *  @details Loads images, videos, and visualizes 3D meshes (PLY) in the browser.
 */

import * as THREE from 'three'; ///< Main Three.js module
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; ///< Enables orbit-style interaction
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'; ///< Loads PLY mesh files

/**
 * @brief Initializes dynamic content after DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function() {

    /**
     * @brief Dynamically loads image thumbnails into the page.
     * @details Appends <img> elements to the container with ID 'image-gallery'.
     */
    function loadImages() {
        const imageContainer = document.getElementById('image-gallery');
        const images = ['model1.jpg', 'model2.jpg', 'model3.jpg']; ///< List of image filenames

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = `images/${image}`;
            imgElement.alt = `Image of ${image}`;
            imgElement.classList.add('model-image');
            imageContainer.appendChild(imgElement);
        });
    }

    /**
     * @brief Dynamically loads video previews into the page.
     * @details Appends <video> elements to the container with ID 'video-gallery'.
     */
    function loadVideos() {
        const videoContainer = document.getElementById('video-gallery');
        const videos = ['model1.mp4', 'model2.mp4', 'model3.mp4']; ///< List of video filenames

        videos.forEach(video => {
            const videoElement = document.createElement('video');
            videoElement.src = `videos/${video}`;
            videoElement.controls = true;
            videoElement.classList.add('model-video');
            videoContainer.appendChild(videoElement);
        });
    }

    /**
     * @brief Initializes the 3D mesh viewer using Three.js.
     * @details Loads a PLY file, adjusts scale and orientation, and renders it in a canvas.
     */
    function initMesh() {
        const meshContainer = document.getElementById('mesh-container');
        if (!meshContainer) return;

        meshContainer.innerHTML = ""; ///< Clear any existing content

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, meshContainer.offsetWidth / meshContainer.offsetHeight, 0.1, 1000);
        camera.position.set(0, -40, 60);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(meshContainer.offsetWidth, meshContainer.offsetHeight);
        meshContainer.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement); ///< User interaction

        // Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 1));
        scene.add(new THREE.DirectionalLight(0xffffff, 0.5));

        // Load PLY mesh
        const loader = new THREE.PLYLoader();
        loader.load('meshes/L.ply', function (geometry) {

            // Invert Z-axis and compute bounding box
            const position = geometry.attributes.position;
            const array = position.array;

            let minX = Infinity, maxX = -Infinity;
            let minY = Infinity, maxY = -Infinity;
            let minZ = Infinity, maxZ = -Infinity;

            for (let i = 0; i < array.length; i += 3) {
                const x = array[i];
                const y = array[i + 1];
                const z = -array[i + 2]; ///< Invert Z-axis

                array[i + 2] = z;

                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
                minZ = Math.min(minZ, z);
                maxZ = Math.max(maxZ, z);
            }

            // Normalize and center the mesh
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            const centerZ = (minZ + maxZ) / 2;

            for (let i = 0; i < array.length; i += 3) {
                array[i]     = (array[i] - centerX) * 10.0;
                array[i + 1] = (array[i + 1] - centerY) * 10.0;
                array[i + 2] = (array[i + 2] - centerZ) * 10.0;
            }

            position.needsUpdate = true;
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();

            // Define material
            let material;
            if (geometry.hasAttribute('color')) {
                material = new THREE.PointsMaterial({ size: 0.15, vertexColors: true });
            } else {
                material = new THREE.PointsMaterial({ color: 0x00aaff, size: 0.15 });
            }

            const points = new THREE.Points(geometry, material);
            scene.add(points);

            // Set camera to Open3D-style view
            camera.position.set(-100, -440, 600);
            camera.up.set(0.5, 2.5, 1.0);
            camera.lookAt(0, 0, 0);
        });

        /**
         * @brief Handles responsive resizing of the viewer.
         */
        window.addEventListener('resize', () => {
            camera.aspect = meshContainer.offsetWidth / meshContainer.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(meshContainer.offsetWidth, meshContainer.offsetHeight);
        });

        /**
         * @brief Renders the scene on each animation frame.
         */
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }

    // Execute all loaders on page ready
    loadImages(); ///< Load static images
    loadVideos(); ///< Load video elements
    initMesh();   ///< Launch 3D viewer
});
