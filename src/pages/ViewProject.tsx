
import { useParams } from 'react-router-dom';
import PotreeViewer from '@/components/PotreeViewer';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cloud } from "lucide-react";
import { Link } from 'react-router-dom';

const ViewProject = () => {
  const { projectId } = useParams();
  
  // Mock project data - in real app this would come from API/database
  const project = {
    id: projectId || '1',
    name: 'Topografía Campus Universidad',
    pointCloudUrl: `/api/projects/${projectId}/pointcloud`
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Link>
          </Button>
          <Cloud className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl">Viizor Point Cloud Hub</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-6">
        <PotreeViewer 
          projectId={project.id}
          projectName={project.name}
          pointCloudUrl={project.pointCloudUrl}
        />
      </div>
    </div>
  );
};

export default ViewProject;
