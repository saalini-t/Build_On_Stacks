import { useRef, useEffect, useState } from "react";
import { initializeGlobe, addProjectMarkers } from "@/lib/three-utils";
import type { Project } from "@shared/schema";

interface ProjectMap3DProps {
  projects: Project[];
}

export default function ProjectMap3D({ projects }: ProjectMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    if (containerRef.current && !sceneRef.current) {
      try {
        setIsLoading(true);
        setError(null);
        sceneRef.current = initializeGlobe(containerRef.current);
        
        // Check if initialization was successful
        if (sceneRef.current.error) {
          setError(sceneRef.current.error);
          setFallbackMode(true);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize 3D globe:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize 3D visualization');
        setFallbackMode(true);
        setIsLoading(false);
      }
    }

    return () => {
      if (sceneRef.current) {
        sceneRef.current.cleanup();
        sceneRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current && projects && !fallbackMode) {
      try {
        addProjectMarkers(sceneRef.current, projects);
      } catch (err) {
        console.error('Failed to add project markers:', err);
      }
    }
  }, [projects, fallbackMode]);

  // Fallback 2D map component
  if (fallbackMode) {
    return (
      <div className="three-js-container relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-blue-200 p-8" data-testid="project-map-fallback">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map Unavailable</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your browser doesn't support 3D visualization. Here's a 2D view of your projects:
          </p>
          
          {/* 2D Project Map Fallback */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    project.status === 'verified' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{project.name}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{project.location}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{project.projectType.replace('_', ' ')}</span>
                  <span className="font-medium">{project.area} ha</span>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => {
              setFallbackMode(false);
              setError(null);
              setIsLoading(true);
              // Retry initialization
              if (containerRef.current) {
                try {
                  sceneRef.current = initializeGlobe(containerRef.current);
                  if (!sceneRef.current.error) {
                    setIsLoading(false);
                  } else {
                    setError(sceneRef.current.error);
                  }
                } catch (err) {
                  setError('Retry failed');
                }
              }
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry 3D Visualization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="three-js-container relative" ref={containerRef} data-testid="project-map-3d">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center animate-spin">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
              </svg>
            </div>
            <p className="text-lg font-medium">Initializing 3D Globe...</p>
            <p className="text-sm opacity-80">Loading interactive project visualization</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm z-10">
          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
              </svg>
            </div>
            <p className="text-lg font-medium">3D Globe Error</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      )}
      
      {/* Project legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg" data-testid="project-legend">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-foreground">Verified Projects</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-xs text-foreground">Pending Projects</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-foreground">Active Projects</span>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <p className="text-xs text-gray-600">
          <strong>Controls:</strong> Drag to rotate • Scroll to zoom • Click markers for details
        </p>
      </div>
    </div>
  );
}
