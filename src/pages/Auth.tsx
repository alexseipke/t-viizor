import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Formulario de login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Formulario de registro
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    company: "",
  });

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };

    checkUser();
  }, [navigate]);

  const getErrorMessage = (error: any) => {
    const errorCode = error.message || error.error_description || '';
    
    // Mensajes específicos en español para errores comunes
    if (errorCode.includes('Invalid login credentials')) {
      return 'Email o contraseña incorrectos. Verifica tus datos e intenta nuevamente.';
    }
    if (errorCode.includes('Email not confirmed')) {
      return 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.';
    }
    if (errorCode.includes('Too many requests')) {
      return 'Demasiados intentos. Espera unos minutos antes de intentar nuevamente.';
    }
    if (errorCode.includes('User not found')) {
      return 'No existe una cuenta con este email. ¿Quieres registrarte?';
    }
    if (errorCode.includes('Invalid email')) {
      return 'El formato del email no es válido.';
    }
    if (errorCode.includes('Password should be at least 6 characters')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (errorCode.includes('User already registered')) {
      return 'Ya existe una cuenta con este email. ¿Quieres iniciar sesión?';
    }
    if (errorCode.includes('Signup is disabled')) {
      return 'El registro está temporalmente deshabilitado. Contacta al administrador.';
    }
    
    // Mensaje genérico para otros errores
    return errorCode || 'Ocurrió un error inesperado. Intenta nuevamente.';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        const errorMessage = getErrorMessage(error);
        toast({
          title: "No se pudo iniciar sesión",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Si el usuario no existe, sugerir registro
        if (error.message.includes('Invalid login credentials')) {
          setTimeout(() => {
            toast({
              title: "¿Usuario nuevo?",
              description: "Si no tienes cuenta, puedes registrarte en la pestaña 'Registrarse'",
            });
          }, 2000);
        }
      } else if (data.user) {
        // Verificar si el email está confirmado
        if (!data.user.email_confirmed_at) {
          toast({
            title: "Email no confirmado",
            description: "Por favor confirma tu email antes de continuar. Revisa tu bandeja de entrada.",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "¡Bienvenido!",
          description: `Hola ${data.user.email}, sesión iniciada correctamente`,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "Verifica tu conexión a internet e intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones completas
    if (!registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Contraseñas no coinciden",
        description: "Asegúrate de que ambas contraseñas sean idénticas",
        variant: "destructive",
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    // Validación de contraseña más robusta
    if (!/(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)/.test(registerData.password)) {
      toast({
        title: "Contraseña débil",
        description: "Usa al menos una mayúscula, minúscula o número para mayor seguridad",
      });
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            display_name: registerData.displayName,
            company: registerData.company,
          }
        }
      });

      if (error) {
        const errorMessage = getErrorMessage(error);
        toast({
          title: "Error en el registro",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Si el usuario ya existe, sugerir login
        if (error.message.includes('User already registered')) {
          setTimeout(() => {
            toast({
              title: "¿Ya tienes cuenta?",
              description: "Puedes iniciar sesión en la pestaña 'Iniciar Sesión'",
            });
            setActiveTab("login");
          }, 2000);
        }
      } else if (data.user) {
        // Limpiar formulario
        setRegisterData({
          email: "",
          password: "",
          confirmPassword: "",
          displayName: "",
          company: "",
        });
        
        toast({
          title: "¡Cuenta creada exitosamente!",
          description: `Se envió un email de confirmación a ${data.user.email}. Revisa tu bandeja de entrada y spam.`,
        });
        
        // Mostrar mensaje adicional
        setTimeout(() => {
          toast({
            title: "Siguiente paso",
            description: "Después de confirmar tu email, podrás iniciar sesión",
          });
        }, 3000);
        
        setActiveTab("login");
        // Pre-llenar el email en login
        setLoginData({ ...loginData, email: registerData.email });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "Verifica tu conexión a internet e intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">t.viizor</CardTitle>
          <CardDescription>
            Plataforma de visualización de nubes de puntos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nombre completo</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={registerData.displayName}
                    onChange={(e) => setRegisterData({ ...registerData, displayName: e.target.value })}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa (opcional)</Label>
                  <Input
                    id="company"
                    type="text"
                    value={registerData.company}
                    onChange={(e) => setRegisterData({ ...registerData, company: e.target.value })}
                    placeholder="Nombre de tu empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="registerPassword"
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      placeholder="Mínimo 6 caracteres"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                    placeholder="Confirma tu contraseña"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;