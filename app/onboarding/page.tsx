"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { CheckCircle2, Github, Loader2, Sparkles } from "lucide-react";

const steps = [
  { title: "Authenticating", description: "Connecting to GitHub..." },
  { title: "Scanning repositories", description: "Finding your BD-tracked repos..." },
  { title: "Loading issues", description: "Parsing .beads/issues.jsonl files..." },
  { title: "Building graphs", description: "Analyzing dependencies..." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    if (session) {
      // Simulate onboarding steps
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setIsComplete(true);
              setTimeout(() => router.push("/dashboard"), 1000);
            }, 1000);
            return prev;
          }
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
            >
              {isComplete ? (
                <CheckCircle2 className="h-10 w-10 text-white" />
              ) : (
                <Sparkles className="h-10 w-10 text-white" />
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white mb-3"
            >
              {isComplete ? "You're all set!" : "Setting up your workspace"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400"
            >
              {isComplete
                ? "Redirecting to your dashboard..."
                : "This will only take a moment..."}
            </motion.p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || isComplete;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-500/10 border-2 border-blue-500/30"
                      : isCompleted
                      ? "bg-green-500/10 border-2 border-green-500/30"
                      : "bg-slate-800/30 border-2 border-transparent"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? "bg-blue-500"
                        : isCompleted
                        ? "bg-green-500"
                        : "bg-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`font-semibold ${
                        isActive || isCompleted
                          ? "text-white"
                          : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isActive ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-8 border-t border-slate-800 text-center"
          >
            <p className="text-sm text-slate-500">
              Connected as <span className="text-white font-medium">{session?.user?.name || "User"}</span>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
