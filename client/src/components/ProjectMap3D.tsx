import { useRef, useEffect } from "react";
import { initializeGlobe, addProjectMarkers } from "@/lib/three-utils";
import type { Project } from "@shared/schema";

interface ProjectMap3DProps {
  projects: Project[];
}

export default function ProjectMap3D({ projects }: ProjectMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current && !sceneRef.current) {
      sceneRef.current = initializeGlobe(containerRef.current);
    }

    return () => {
      if (sceneRef.current) {
        sceneRef.current.cleanup();
        sceneRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current && projects) {
      addProjectMarkers(sceneRef.current, projects);
    }
  }, [projects]);

  return (
    <div className="three-js-container relative" ref={containerRef} data-testid="project-map-3d">
      {/* Fallback content while Three.js loads */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
            </svg>
          </div>
          <p className="text-lg font-medium">3D Globe Loading...</p>
          <p className="text-sm opacity-80">Interactive project visualization</p>
        </div>
      </div>
      
      {/* Project legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3" data-testid="project-legend">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-xs text-foreground">Active Projects</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-secondary rounded-full"></div>
          <span className="text-xs text-foreground">Completed Projects</span>
        </div>
      </div>
    </div>
  );
}
