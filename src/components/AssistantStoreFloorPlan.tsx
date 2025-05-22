import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface AssistantStoreFloorPlanProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}

const FloorPlanContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
`;

const AssistantStoreFloorPlan: React.FC<AssistantStoreFloorPlanProps> = ({ src, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    console.log('Initializing store floor plan with src:', src);

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // Create a temporary image element to load the SVG
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('Image loaded successfully, dimensions:', img.width, 'x', img.height);
      
      // Create a canvas to render the SVG
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        console.log('Image drawn to canvas');
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        console.log('Texture created from canvas, dimensions:', texture.image.width, 'x', texture.image.height);
        
        // Create plane with aspect ratio matching the image
        const aspectRatio = img.width / img.height;
        const planeWidth = 4;
        const planeHeight = planeWidth / aspectRatio;
        
        console.log('Creating plane with dimensions:', planeWidth, 'x', planeHeight);
        
        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        });
        
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
        
        // Center the plane
        const box = new THREE.Box3().setFromObject(plane);
        const center = box.getCenter(new THREE.Vector3());
        plane.position.sub(center);
        
        console.log('Plane centered at:', plane.position);
        
        // Adjust camera to fit the plane
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
        camera.position.z = cameraZ * 1.5;
        camera.updateProjectionMatrix();
        
        console.log('Camera adjusted, position:', camera.position);
        console.log('Scene objects:', scene.children.length);
      } else {
        console.error('Failed to get canvas context');
      }
    };
    
    img.onerror = (error) => {
      console.error('Error loading image:', error);
    };
    
    // Load the SVG
    img.src = src;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
    };
  }, [src]);

  return <FloorPlanContainer ref={containerRef} style={style} />;
};

export default AssistantStoreFloorPlan; 