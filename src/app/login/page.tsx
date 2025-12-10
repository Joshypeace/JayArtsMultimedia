"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReCaptcha from "@/components/ui/recaptcha";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate inputs
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        recaptchaToken,
        redirect: false,
      });

      if (result?.error) {
        // Handle specific error messages
        const errorMessage = result.error.includes("No user found") 
          ? "Invalid email or password"
          : result.error.includes("Incorrect password")
          ? "Invalid email or password"
          : result.error.includes("permission")
          ? "You don't have permission to access the admin panel"
          : "Login failed. Please try again.";
        
        setError(errorMessage);
        
        // Reset reCAPTCHA on error
        setRecaptchaToken("");
      } else {
        // Successful login - redirect to admin dashboard
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setRecaptchaToken("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !recaptchaToken}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 space-y-3 text-center">
            <div className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link 
                href="/register" 
                className="text-primary hover:underline font-medium transition-colors"
              >
                Register here
              </Link>
            </div>
            <div>
              <Link 
                href="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                ← Back to website
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ReCaptcha 
        action="login" 
        onVerify={(token: string) => {
          setRecaptchaToken(token);
          // Clear any previous errors when reCAPTCHA is verified
          if (error.includes("reCAPTCHA")) {
            setError("");
          }
        }} 
      />
    </div>
  );
}