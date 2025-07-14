
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/FileUpload";
import { 
  Cloud, 
  Upload, 
  Eye, 
  Share2, 
  Calendar, 
  HardDrive,
  Play,
  Download,
  Settings,
  Plus,
  FileText,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const [storageUsed] = useState(2.3); // GB
  const [trialDaysLeft] = useState(5);
  
  // Mock data for projects
  const projects = [
    {
      id: 1,
      name: "Topografía Campus Universidad",
      status: "completed",
      uploadDate: "2024-01-15",
      fileSize: "450 MB",
      format: ".laz",
      sharedLinks: 2
    },
    {
      id: 2,
      name: "Levantamiento Edificio Histórico",
      status: "processing",
      uploadDate: "2024-01-16",
      fileSize: "1.2 GB",
      format: ".las",
      sharedLinks: 0,
      progress: 65
    },
    {
      id: 3,
      name: "Análisis Forestal Zona Norte",
      status: "ready",
      uploadDate: "2024-01-14",
      fileSize: "780 MB",
      format: ".laz",
      sharedLinks: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completado</Badge>;
      case 'processing':
        return <Badge variant="secondary">Procesando</Badge>;
      case 'ready':
        return <Badge className="bg-blue-500">Listo para ver</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const handleUploadComplete = (projectId: string) => {
    console.log('Upload completed for project:', projectId);
    // TODO: Refresh projects list or redirect to project view
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Cloud className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Trial: {trialDaysLeft} días restantes
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Totales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+1 este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Almacenamiento</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageUsed}GB</div>
              <Progress value={(storageUsed / 5) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">de 5GB disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enlaces Compartidos</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Links activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Procesamiento</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Proyecto procesando</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Mis Proyectos</TabsTrigger>
            <TabsTrigger value="upload">Subir Archivo</TabsTrigger>
            <TabsTrigger value="shared">Enlaces Compartidos</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mis Proyectos</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </div>

            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          Subido: {project.uploadDate}
                          <span className="mx-2">•</span>
                          {project.fileSize} ({project.format})
                        </CardDescription>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {project.status === 'processing' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Procesando con PotreeConverter...</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Share2 className="h-4 w-4 mr-1" />
                        {project.sharedLinks} enlaces compartidos
                      </div>
                      
                      <div className="flex space-x-2">
                        {project.status === 'completed' || project.status === 'ready' ? (
                          <>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver en Potree
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Compartir
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            <Clock className="h-4 w-4 mr-2" />
                            Procesando...
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <FileUpload onUploadComplete={handleUploadComplete} />
          </TabsContent>

          <TabsContent value="shared" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enlaces Compartidos</CardTitle>
                <CardDescription>
                  Gestiona los enlaces que has compartido con colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Share2 className="h-12 w-12 mx-auto mb-4" />
                  <p>Cuando compartas proyectos, aparecerán aquí</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
