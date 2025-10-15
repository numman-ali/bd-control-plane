"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const handleGitHubLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/onboarding",
      });
    } catch (error) {
      toast.error("Failed to sign in. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Branding */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            BD Control Plane
          </span>
        </Link>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Sign in to access your BD dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* GitHub Sign In */}
            <Button
              onClick={handleGitHubLogin}
              size="lg"
              className="w-full text-lg py-6 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700"
            >
              <Github className="mr-3 h-5 w-5" />
              Continue with GitHub
            </Button>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center mb-4">
                WHY SIGN IN WITH GITHUB?
              </p>

              {[
                { icon: Shield, text: "Secure OAuth authentication" },
                { icon: Github, text: "Access your repositories" },
                { icon: Zap, text: "Instant BD issue scanning" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm text-slate-400"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Privacy Note */}
            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center leading-relaxed">
                We only request the permissions we need to read your BD repositories.
                Your data stays on GitHub.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
