// Three.js utilities for 3D globe and project visualization
import * as THREE from 'three';
import type { Project } from "@shared/schema";

interface ThreeScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  globe: THREE.Mesh;
  markers: THREE.Group;
  controls: any;
  cleanup: () => void;
}

export function initializeGlobe(container: HTMLElement): ThreeScene {
  try {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.8,
      wireframe: false,
    });
    
    // Add ocean texture-like appearance
    const oceanMaterial = new THREE.MeshPhongMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.7,
    });

    const globe = new THREE.Mesh(globeGeometry, oceanMaterial);
    scene.add(globe);

    // Add continents as wireframe overlay
    const continentGeometry = new THREE.SphereGeometry(2.01, 32, 32);
    const continentMaterial = new THREE.MeshBasicMaterial({
      color: 0x059669,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    });
    const continents = new THREE.Mesh(continentGeometry, continentMaterial);
    scene.add(continents);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Marker group for projects
    const markers = new THREE.Group();
    scene.add(markers);

    // Camera position
    camera.position.z = 6;
    camera.position.y = 2;
    camera.position.x = 2;
    camera.lookAt(0, 0, 0);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Rotate globe slowly
      globe.rotation.y += 0.002;
      continents.rotation.y += 0.002;
      markers.rotation.y += 0.002;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Mouse interaction for rotation control
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseDown = (event: MouseEvent) => {
      mouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      mouseDown = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      globe.rotation.y += deltaX * 0.01;
      globe.rotation.x += deltaY * 0.01;
      continents.rotation.y += deltaX * 0.01;
      continents.rotation.x += deltaY * 0.01;
      markers.rotation.y += deltaX * 0.01;
      markers.rotation.x += deltaY * 0.01;
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return {
      scene,
      camera,
      renderer,
      globe,
      markers,
      controls: null,
      cleanup: () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  } catch (error) {
    console.error('Failed to initialize Three.js globe:', error);
    
    // Return a mock scene for fallback
    return {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(),
      renderer: new THREE.WebGLRenderer(),
      globe: new THREE.Mesh(),
      markers: new THREE.Group(),
      controls: null,
      cleanup: () => {}
    };
  }
}

export function addProjectMarkers(threeScene: ThreeScene, projects: Project[]) {
  if (!threeScene || !threeScene.markers) return;

  // Clear existing markers
  threeScene.markers.clear();

  projects.forEach((project) => {
    try {
      // Convert lat/lng to 3D coordinates on sphere
      const lat = parseFloat(project.latitude) * (Math.PI / 180);
      const lng = parseFloat(project.longitude) * (Math.PI / 180);
      const radius = 2.1; // Slightly above globe surface

      const x = radius * Math.cos(lat) * Math.cos(lng);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lng);

      // Create marker based on project status
      const markerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: project.status === 'verified' ? 0x059669 : 0xeab308,
        transparent: true,
        opacity: 0.9,
      });

      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);

      // Add pulsing animation for active projects
      if (project.status === 'verified') {
        const pulseGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const pulseMaterial = new THREE.MeshBasicMaterial({
          color: 0x059669,
          transparent: true,
          opacity: 0.3,
        });
        const pulseMarker = new THREE.Mesh(pulseGeometry, pulseMaterial);
        pulseMarker.position.set(x, y, z);
        
        // Animate pulse
        let pulseScale = 1;
        const animatePulse = () => {
          pulseScale += 0.02;
          if (pulseScale > 1.5) pulseScale = 1;
          pulseMarker.scale.setScalar(pulseScale);
          pulseMaterial.opacity = 0.3 * (1.5 - pulseScale);
        };
        
        // Store animation function for cleanup
        (pulseMarker as any).animate = animatePulse;
        
        threeScene.markers.add(pulseMarker);
      }

      // Add project type indicator
      const typeColor = getProjectTypeColor(project.projectType);
      const ringGeometry = new THREE.RingGeometry(0.06, 0.08, 16);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: typeColor,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(x, y, z);
      ring.lookAt(threeScene.camera.position);

      threeScene.markers.add(marker);
      threeScene.markers.add(ring);

      // Store project data for interaction
      (marker as any).projectData = project;
      (ring as any).projectData = project;

    } catch (error) {
      console.error('Error creating marker for project:', project.id, error);
    }
  });
}

function getProjectTypeColor(projectType: string): number {
  switch (projectType) {
    case 'mangrove':
      return 0x059669; // Green
    case 'seagrass':
      return 0x0ea5e9; // Blue  
    case 'salt_marsh':
      return 0xf59e0b; // Orange
    default:
      return 0x6b7280; // Gray
  }
}

export function createProjectInfoPanel(project: Project): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-sm';
  panel.style.zIndex = '10';
  
  panel.innerHTML = `
    <h3 class="font-semibold text-foreground mb-2">${project.name}</h3>
    <p class="text-sm text-muted-foreground mb-2">${project.location}</p>
    <div class="space-y-1 text-xs">
      <div><span class="font-medium">Type:</span> ${project.projectType.replace('_', ' ')}</div>
      <div><span class="font-medium">Area:</span> ${project.area} ha</div>
      <div><span class="font-medium">Status:</span> ${project.status}</div>
      <div><span class="font-medium">Credits:</span> ${project.estimatedCredits}</div>
    </div>
  `;
  
  return panel;
}

// Export Three.js namespace for external use
export { THREE };
