import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/FileUpload";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Cloud, 
  Eye, 
  Share2, 
  Calendar, 
  HardDrive,
  Play,
  Download,
  Settings,
  Plus,
  FileText,
  Clock,
  LogOut
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: string;
  original_filename?: string;
  file_size?: number;
  processing_progress?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageUsed, setStorageUsed] = useState(0);

  // Obtener proyectos del usuario
  const fetchProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
      
      // Calcular almacenamiento usado
      const totalSize = data?.reduce((acc, project) => acc + (project.file_size || 0), 0) || 0;
      setStorageUsed(totalSize / (1024 * 1024 * 1024)); // Convertir a GB
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completado</Badge>;
      case 'processing':
        return <Badge variant="secondary">Procesando</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500">Pendiente</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const handleUploadComplete = () => {
    // Recargar proyectos después de subir
    fetchProjects();
  };

  const processingProjects = projects.filter(p => p.status === 'processing').length;
  const sharedLinks = 0; // TODO: Implementar conteo de enlaces compartidos

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Cloud className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl">t.viizor Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Hola, {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
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
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">archivos subidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Almacenamiento</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageUsed.toFixed(2)}GB</div>
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
              <div className="text-2xl font-bold">{sharedLinks}</div>
              <p className="text-xs text-muted-foreground">Links activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Procesamiento</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processingProjects}</div>
              <p className="text-xs text-muted-foreground">Proyectos procesando</p>
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
            </div>

            {loading ? (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Cargando proyectos...</p>
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No tienes proyectos aún</h3>
                  <p className="text-muted-foreground mb-4">
                    Sube tu primer archivo .las/.laz para comenzar
                  </p>
                  <Button asChild>
                    <a href="#upload">
                      <Plus className="h-4 w-4 mr-2" />
                      Subir primer proyecto
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            Subido: {formatDate(project.created_at)}
                            {project.original_filename && (
                              <>
                                <span className="mx-2">•</span>
                                {formatFileSize(project.file_size)} ({project.original_filename.split('.').pop()?.toUpperCase()})
                              </>
                            )}
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
                            <span>{project.processing_progress || 0}%</span>
                          </div>
                          <Progress value={project.processing_progress || 0} />
                        </div>
                      )}

                      {project.status === 'error' && project.error_message && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                          <p className="text-sm text-destructive">{project.error_message}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Share2 className="h-4 w-4 mr-1" />
                          0 enlaces compartidos
                        </div>
                        
                        <div className="flex space-x-2">
                          {project.status === 'completed' ? (
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
                          ) : project.status === 'processing' ? (
                            <Button variant="outline" size="sm" disabled>
                              <Clock className="h-4 w-4 mr-2" />
                              Procesando...
                            </Button>
                          ) : project.status === 'error' ? (
                            <Button variant="outline" size="sm">
                              Reintentar
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              <Clock className="h-4 w-4 mr-2" />
                              Pendiente...
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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