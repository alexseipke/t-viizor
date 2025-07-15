
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Zap, Shield, Users, Globe, ChevronRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: Cloud,
      title: "Procesamiento de Nubes de Puntos",
      description: "Sube archivos .las/.laz y conviértelos automáticamente con PotreeConverter"
    },
    {
      icon: Globe,
      title: "Visualización Avanzada",
      description: "Visualiza tus nubes de puntos georreferenciadas con Potree Viewer"
    },
    {
      icon: Users,
      title: "Colaboración",
      description: "Comparte enlaces personalizados con colegas y colaboradores"
    },
    {
      icon: Shield,
      title: "Seguro y Confiable",
      description: "Almacenamiento seguro con hasta 5GB por usuario"
    }
  ];

  const pricingPlans = [
    {
      name: "Trial",
      price: "Gratis",
      duration: "7 días",
      features: ["Hasta 5GB de almacenamiento", "Procesamiento básico", "Visualización web", "Soporte por email"],
      highlighted: false
    },
    {
      name: "Professional",
      price: "$29",
      duration: "/mes",
      features: ["5GB de almacenamiento", "Procesamiento ilimitado", "Enlaces compartidos", "Soporte prioritario", "Colaboración en tiempo real"],
      highlighted: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Cloud className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl">Viizor Point Cloud Hub</span>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium ml-auto">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Mi Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link to="/auth" className="text-foreground/60 hover:text-foreground">
                  Iniciar Sesión
                </Link>
                <Button asChild>
                  <Link to="/auth">Comenzar Trial</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Plataforma de Nubes de Puntos Georreferenciadas
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-red-500">
            esto es t.viizor,
            <span className="text-red-600 block">datos geoespaciales</span>
            tratados con amor
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Sube archivos .las/.laz, procésalos automáticamente con PotreeConverter y visualízalos 
            con Potree Viewer. Todo en una plataforma segura y colaborativa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link to="/auth">
                Comenzar Trial Gratuito
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Características Principales</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas para trabajar con nubes de puntos georreferenciadas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Planes y Precios</h2>
          <p className="text-muted-foreground">
            Comienza con nuestro trial gratuito de 7 días
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.highlighted ? 'border-primary shadow-lg' : ''}`}>
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Más Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.duration}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-6" 
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link to="/auth">
                    {plan.name === "Trial" ? "Comenzar Trial" : "Suscribirse"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Cloud className="h-5 w-5 text-primary mr-2" />
              <span className="font-semibold">Viizor Point Cloud Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Viizor. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
