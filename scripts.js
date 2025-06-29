import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

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
        if (!meshContainer) return;

        // Clear the container if there's already something
        meshContainer.innerHTML = "";

        // Scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, meshContainer.offsetWidth / meshContainer.offsetHeight, 0.1, 1000);
        camera.position.set(0, -40, 60); // Aproxima a vista de cima, ajusta conforme necessário
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(meshContainer.offsetWidth, meshContainer.offsetHeight);
        meshContainer.appendChild(renderer.domElement);

        // Orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);

        // Ambient light
        scene.add(new THREE.AmbientLight(0xffffff, 1));
        scene.add(new THREE.DirectionalLight(0xffffff, 0.5));

        // Loader for PLY
        const loader = new THREE.PLYLoader();
        loader.load('meshes/L.ply', function (geometry) {
        // Inverter Z e centralizar a point cloud manualmente
        const position = geometry.attributes.position;
        const array = position.array;

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        for (let i = 0; i < array.length; i += 3) {
            const x = array[i];
            const y = array[i + 1];
            const z = -array[i + 2]; // inverte Z aqui

            array[i + 2] = z;

            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
        }

        // Centro da bounding box
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

        let material;
        if (geometry.hasAttribute('color')) {
            material = new THREE.PointsMaterial({ size: 0.15, vertexColors: true });
        } else {
            material = new THREE.PointsMaterial({ color: 0x00aaff, size: 0.15 });
        }

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Câmera: replica Open3D
        camera.position.set(-100, -440, 600);
        camera.up.set(0.5, 2.5, 1.0);
        camera.lookAt(0, 0, 0);
    });


        // Responsive
        window.addEventListener('resize', () => {
            camera.aspect = meshContainer.offsetWidth / meshContainer.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(meshContainer.offsetWidth, meshContainer.offsetHeight);
        });

        // Animation
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }

    // Load images, videos, and initialize mesh on page load
    loadImages();
    loadVideos();
    initMesh();
});