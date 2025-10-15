"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Github,
  Zap,
  Network,
  BarChart3,
  KanbanSquare,
  GitBranch,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  Check
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: Network,
    title: "Interactive Dependency Graphs",
    description: "Visualize complex issue relationships with beautiful, interactive graphs powered by React Flow",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: KanbanSquare,
    title: "Kanban Boards",
    description: "Track your issues with drag-and-drop kanban boards across all your repositories",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Powerful analytics with charts, metrics, and completion rates to track your progress",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: GitBranch,
    title: "Multi-Repo Support",
    description: "Aggregate and manage BD issues across all your GitHub repositories in one place",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team, track assignments, and manage dependencies",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data stays on GitHub. We only read public repos or what you authorize",
    color: "from-slate-500 to-gray-500",
  },
];

const stats = [
  { value: "100%", label: "Open Source" },
  { value: "<100ms", label: "Load Time" },
  { value: "∞", label: "Repositories" },
  { value: "0", label: "Vendor Lock-in" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
                style={{
                  top: `${(i + 1) * 5}%`,
                }}
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
            >
              <Sparkles className="h-4 w-4" />
              <span>Powered by BD (Beads) & GitHub</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mission Control
              </span>
              <br />
              <span className="text-white">for Your Issues</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The ultimate dashboard for BD (Beads) issue tracking.
              Visualize dependencies, track progress, and manage issues across
              all your GitHub repositories.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Github className="mr-2 h-5 w-5" />
                  Sign in with GitHub
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-slate-700 hover:bg-slate-800">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
            >
              {stats.map((stat, i) => (
                <motion.div key={i} variants={itemVariants} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-slate-400"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built with the latest tech stack for maximum performance and developer experience
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-blue-500/10 h-full">
                    <CardContent className="p-8">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-0.5 mb-6`}>
                        <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Get Started in Seconds
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Connect your GitHub account and we'll do the rest
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-12">
            {[
              {
                step: "01",
                title: "Sign in with GitHub",
                description: "Authenticate with your GitHub account using OAuth. We only request the permissions we need.",
              },
              {
                step: "02",
                title: "We scan your repos",
                description: "We automatically discover all repositories with .beads/ directories and load your issues.",
              },
              {
                step: "03",
                title: "Start managing",
                description: "View graphs, track progress, manage dependencies, and collaborate with your team.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex gap-8 items-start"
              >
                <div className="text-6xl font-bold bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-1"
          >
            <div className="rounded-3xl bg-slate-900 p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to Take Control?
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join developers using BD Control Plane to manage their issues more effectively
              </p>
              <Link href="/login">
                <Button size="lg" className="text-lg px-10 py-7 bg-white text-slate-900 hover:bg-slate-100">
                  <Github className="mr-2 h-5 w-5" />
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                BD Control Plane
              </span>
            </div>
            <div className="flex items-center gap-6 text-slate-400">
              <Link href="https://github.com/numman-ali/bd-control-plane" className="hover:text-white transition">
                <Github className="h-5 w-5" />
              </Link>
              <a href="https://github.com/steveyegge/beads" className="hover:text-white transition text-sm">
                Powered by BD
              </a>
              <span className="text-sm">
                Built with ❤️ by Claude Code
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
