"use client";

import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Clock, CheckCircle, XCircle } from "lucide-react";

// Inner component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "rejected" | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const registered = searchParams.get("registered") === "true";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setApprovalStatus(null);
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        // Check for specific error messages
        if (result.error.includes("pending approval")) {
          setApprovalStatus("pending");
        } else if (result.error.includes("rejected")) {
          setApprovalStatus("rejected");
        } else {
          setError("Invalid email or password");
        }
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
        <CardDescription className="text-center">
          Sign in to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Registration Success Message */}
        {registered && (
          <Alert className="mb-4 bg-green-500/10 border-green-500/20">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-sm text-green-500">
              Registration successful! Please wait for admin approval.
            </AlertDescription>
          </Alert>
        )}

        {/* Pending Approval Message */}
        {approvalStatus === "pending" && (
          <Alert className="mb-4 bg-yellow-500/10 border-yellow-500/20">
            <Clock className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-sm text-yellow-500">
              Your account is pending approval. You&apos;ll be able to log in once an administrator approves your account.
            </AlertDescription>
          </Alert>
        )}

        {/* Rejected Account Message */}
        {approvalStatus === "rejected" && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Your registration was rejected. Please contact support for assistance.
            </AlertDescription>
          </Alert>
        )}

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
              autoComplete="email"
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
              autoComplete="current-password"
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
              disabled={isLoading}
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
  );
}

// Main page component with Suspense
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}