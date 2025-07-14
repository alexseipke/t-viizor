
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Maximize, 
  Minimize, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Settings,
  Share2,
  Download,
  Ruler,
  Eye
} from "lucide-react";

interface PotreeViewerProps {
  projectId: string;
  projectName: string;
  pointCloudUrl?: string;
}

const PotreeViewer = ({ projectId, projectName, pointCloudUrl }: PotreeViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewerLoaded, setViewerLoaded] = useState(false);

  useEffect(() => {
    // TODO: Initialize Potree Viewer here
    // This would load the actual Potree library and initialize the viewer
    console.log(`Initializing Potree Viewer for project ${projectId}`);
    console.log(`Point cloud URL: ${pointCloudUrl}`);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setViewerLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [projectId, pointCloudUrl]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/view/${projectId}`;
    navigator.clipboard.writeText(shareUrl);
    // TODO: Show toast notification
    console.log('Share URL copied to clipboard:', shareUrl);
  };

  return (
    <div className="w-full h-full">
      {/* Viewer Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 text-primary mr-2" />
                {projectName}
              </CardTitle>
              <div className="flex items-center mt-2 space-x-4">
                <Badge variant="secondary">Proyecto #{projectId}</Badge>
                <Badge className="bg-green-500">Potree Viewer</Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Viewer Container */}
      <Card className="flex-1">
        <CardContent className="p-0 relative">
          <div 
            ref={viewerRef}
            className="w-full h-[70vh] bg-slate-900 rounded-lg relative overflow-hidden"
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-lg">Cargando Potree Viewer...</p>
                  <p className="text-sm text-slate-400">Inicializando visualización 3D</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <div className="text-center text-white">
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <Eye className="h-16 w-16 text-slate-400" />
                      </div>
                      <p className="text-lg">Vista 3D de Nube de Puntos</p>
                      <p className="text-sm text-slate-400">
                        Aquí se cargaría el Potree Viewer con los datos procesados
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Viewer Controls Overlay */}
            {viewerLoaded && (
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={toggleFullscreen}
                  className="backdrop-blur-sm bg-black/50 text-white border-white/20"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="backdrop-blur-sm bg-black/50 text-white border-white/20"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="backdrop-blur-sm bg-black/50 text-white border-white/20"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="backdrop-blur-sm bg-black/50 text-white border-white/20"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="backdrop-blur-sm bg-black/50 text-white border-white/20"
                >
                  <Ruler className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="backdrop-blur-sm bg-black/50 text-white border-white/20"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Viewer Information */}
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold">Puntos totales:</span>
              <p className="text-muted-foreground">~2.4M puntos</p>
            </div>
            <div>
              <span className="font-semibold">Resolución:</span>
              <p className="text-muted-foreground">0.05m promedio</p>
            </div>
            <div>
              <span className="font-semibold">Sistema de coordenadas:</span>
              <p className="text-muted-foreground">WGS84 / UTM Zone 18S</p>
            </div>
            <div>
              <span className="font-semibold">Formato original:</span>
              <p className="text-muted-foreground">LAS 1.4</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PotreeViewer;
