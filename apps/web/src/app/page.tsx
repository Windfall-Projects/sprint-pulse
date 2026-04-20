"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  ChartBarIcon, 
  BoltIcon, 
  UserGroupIcon, 
  ArrowRightIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

export default function Home() {
  const router = useRouter();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15 
      }
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Background ambient glow effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-ring/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 space-y-24">
        
        {/* Hero Section */}
        <motion.div 
          className="text-center space-y-8 pt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-4 shadow"
            whileHover={{ scale: 1.05 }}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Introducing Sprint Pulse</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            Master your sprint,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-ring">
              elevate your team.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            Experience the next generation of agile project management. Built for performance, designed for true collaboration.
          </p>

          <div className="flex items-center justify-center space-x-4 pt-4">
            <Button size="lg" className="group" onClick={() => router.push('/signup')}>
              Get Started
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => router.push('/login')}>
              Log In
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8"
        >
          <Card className="flex flex-col items-start space-y-4">
            <div className="p-3 bg-primary/20 text-primary rounded-lg">
              <BoltIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="text-muted-foreground leading-relaxed">
              Built on React with Motion animations and Tailwind CSS for unparalleled performance and seamless transitions.
            </p>
          </Card>

          <Card className="flex flex-col items-start space-y-4" glass={true}>
            <div className="p-3 bg-ring/20 text-ring rounded-lg">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Deep Insights</h3>
            <p className="text-muted-foreground leading-relaxed">
              Real-time analytics and tracking to keep the pulse of your development processes at all times.
            </p>
          </Card>

          <Card className="flex flex-col items-start space-y-4">
            <div className="p-3 bg-primary/20 text-primary rounded-lg">
              <UserGroupIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Team Synergy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Cross-functional harmony driven by beautifully designed, highly accessible headless UI components.
            </p>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
