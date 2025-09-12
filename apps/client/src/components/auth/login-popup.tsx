import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import authClient from "~/lib/auth/auth-client";

interface LoginPopupProps {
  children: React.ReactNode;
}

export function LoginPopup({ children }: LoginPopupProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/app",
    });
    setLoading(false);
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password) return;

    setLoading(true);
    setErrorMessage("");

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/app",
      },
      {
        onError: (ctx) => {
          setErrorMessage(ctx.error.message);
          setLoading(false);
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-2xl font-bold">
            Login to FamCare
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Continue with Google or Email & Password
          </p>
        </DialogHeader>

        {!showEmailForm ? (
          <>
            <Button
              onClick={signInWithGoogle}
              variant="outline"
              className="w-full h-12 text-base font-medium relative overflow-hidden group hover:bg-accent/50 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 mr-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  Continue with Google
                </>
              )}
            </Button>

            <Separator className="my-6" />

            <Button
              variant="ghost"
              onClick={() => setShowEmailForm(true)}
              className="w-full"
            >
              Login with Email & Password
            </Button>
          </>
        ) : (
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hello@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowEmailForm(false)}
              disabled={loading}
            >
              Back to Google Login
            </Button>
          </form>
        )}

        <Separator className="my-6" />

        <div className="text-center text-xs text-muted-foreground leading-relaxed">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="underline hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
