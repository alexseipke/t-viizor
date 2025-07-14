
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Cloud,
  Zap
} from "lucide-react";

interface FileUploadProps {
  onUploadComplete?: (projectId: string) => void;
}

const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [projectName, setProjectName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.name.toLowerCase().endsWith('.las') || 
      file.name.toLowerCase().endsWith('.laz')
    );
    
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => 
        file.name.toLowerCase().endsWith('.las') || 
        file.name.toLowerCase().endsWith('.laz')
      );
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (files.length === 0 || !projectName.trim()) return;
    
    setIsUploading(true);
    
    // Simulate upload process for each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `${file.name}-${i}`;
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: progress
        }));
      }
    }
    
    // Simulate project creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsUploading(false);
    
    // TODO: Create actual project in database
    const mockProjectId = `proj_${Date.now()}`;
    console.log('Project created:', { projectName, files, projectId: mockProjectId });
    
    if (onUploadComplete) {
      onUploadComplete(mockProjectId);
    }
    
    // Reset form
    setFiles([]);
    setProjectName('');
    setUploadProgress({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 text-primary mr-2" />
          Subir Nueva Nube de Puntos
        </CardTitle>
        <CardDescription>
          Sube archivos .las o .laz para procesarlos automáticamente con PotreeConverter
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Project Name Input */}
        <div className="space-y-2">
          <Label htmlFor="projectName">Nombre del Proyecto</Label>
          <Input
            id="projectName"
            placeholder="Ej: Levantamiento Topográfico Campus Norte"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Cloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Arrastra archivos aquí o haz clic para seleccionar
          </h3>
          <p className="text-muted-foreground mb-4">
            Formatos soportados: .las, .laz (máx. 2GB por archivo)
          </p>
          
          <input
            type="file"
            multiple
            accept=".las,.laz"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button asChild>
            <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
              Seleccionar Archivos
            </label>
          </Button>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Archivos Seleccionados ({files.length})</h4>
            
            <div className="space-y-2">
              {files.map((file, index) => {
                const fileId = `${file.name}-${index}`;
                const progress = uploadProgress[fileId] || 0;
                const isCompleted = progress === 100;
                
                return (
                  <div key={fileId} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <File className="h-8 w-8 text-primary flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {file.name.toLowerCase().endsWith('.las') ? 'LAS' : 'LAZ'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                      
                      {isUploading && (
                        <div className="space-y-1">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {isCompleted ? 'Completado' : `Subiendo... ${progress}%`}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : isUploading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Processing Information */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Proceso Automático de Conversión</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Los archivos se suben de forma segura a nuestros servidores</li>
                  <li>PotreeConverter procesa automáticamente las nubes de puntos</li>
                  <li>Se optimizan para visualización web con Potree Viewer</li>
                  <li>Recibes una notificación por email cuando estén listos</li>
                  <li>Los proyectos aparecen en tu dashboard para visualizar</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleUpload}
            disabled={files.length === 0 || !projectName.trim() || isUploading}
            size="lg"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Subiendo Proyecto...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Crear Proyecto ({files.length} {files.length === 1 ? 'archivo' : 'archivos'})
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
