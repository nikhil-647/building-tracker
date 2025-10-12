import { Activity, TrendingUp, Target, Calendar, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GymIcon, gymIcons } from "@/lib/gym-icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Activity className="w-4 h-4" />
            Your Personal Tracker
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
            Track Everything
            <br />
            That Matters
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Monitor your exercise routines, daily activities, and build lasting habits. 
            Simple, elegant, and powerful tracking for your everyday life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-8 py-6 text-base hover:scale-105 shadow-lg hover:shadow-xl transition-transform">
                Start Tracking Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-6 text-base">
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {/* Feature 1 */}
          <Card className="group hover:shadow-xl transition-all hover:border-blue-200 hover:-translate-y-1">
            <CardHeader>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <GymIcon icon={gymIcons.strength} className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Exercise Tracking</CardTitle>
              <CardDescription className="text-base">
                Log your workouts, set goals, and watch your progress soar with detailed analytics.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 2 */}
          <Card className="group hover:shadow-xl transition-all hover:border-purple-200 hover:-translate-y-1">
            <CardHeader>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Daily Activities</CardTitle>
              <CardDescription className="text-base">
                Keep tabs on your daily routines and build consistent habits that stick.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 3 */}
          <Card className="group hover:shadow-xl transition-all hover:border-green-200 hover:-translate-y-1">
            <CardHeader>
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Progress Insights</CardTitle>
              <CardDescription className="text-base">
                Visualize your journey with beautiful charts and meaningful statistics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl max-w-5xl mx-auto">
          <CardContent className="pt-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="flex items-center justify-center mb-3">
                  <Target className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-slate-400">Customizable</div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-center mb-3">
                  <Heart className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">Simple</div>
                <div className="text-slate-400">Easy to Use</div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-center mb-3">
                  <Activity className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">Powerful</div>
                <div className="text-slate-400">Tracking Tools</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-600">
          <p>Built with ❤️ for better habits</p>
        </div>
      </footer>
    </div>
  );
}
