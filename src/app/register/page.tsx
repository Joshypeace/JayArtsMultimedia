"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Clock, MailCheck } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPendingApproval(false);

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Show success message with approval info
      setSuccess(data.message || "Registration successful!");
      setPendingApproval(true);
      
      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      // Optional: Redirect to login after 5 seconds
      // setTimeout(() => {
      //   router.push("/login");
      // }, 5000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Register for a JayArts Multimedia account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pendingApproval ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full"
                  autoComplete="name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
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
                  Password <span className="text-red-500">*</span>
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
                  autoComplete="new-password"
                />
                <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                  <li className={password.length >= 8 ? "text-green-500" : ""}>
                    ✓ At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
                    ✓ One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>
                    ✓ One lowercase letter
                  </li>
                  <li className={/\d/.test(password) ? "text-green-500" : ""}>
                    ✓ One number
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full"
                  autoComplete="new-password"
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
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            // Success/Pending Approval Message
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Account Pending Approval</h3>
                <p className="text-center text-muted-foreground">
                  {success || "Your account has been created and is awaiting administrator approval."}
                </p>
              </div>

              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MailCheck className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">
                      <span className="font-medium text-foreground">What happens next?</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>An administrator will review your registration</li>
                      <li>You&apos;ll receive an email once your account is approved</li>
                      <li>Then you can log in to access the admin area</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  Go to Login
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setPendingApproval(false)}
                >
                  Create Another Account
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 space-y-3 text-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-primary hover:underline font-medium transition-colors"
              >
                Sign in here
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
    </div>
  );
}