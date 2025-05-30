
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, MessageCircle, ArrowRight, Brain, Heart, Target } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleExperienceSelect = (experience: string) => {
    setSelectedExperience(experience);
    setShowChat(true);
  };

  const resetSelection = () => {
    setSelectedExperience(null);
    setShowChat(false);
  };

  if (showChat && selectedExperience) {
    return (
      <ChatInterface 
        patientType={selectedExperience}
        onBack={resetSelection}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                TherapySim
              </h1>
              <p className="text-sm text-blue-600 font-medium tracking-wide uppercase mt-1">
                AI-Powered Training Platform
              </p>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Master your therapeutic skills through realistic AI patient simulations. 
            Practice challenging scenarios in a safe, supportive environment designed for professional growth.
          </p>
          
          {/* Trust indicators */}
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Confidential & Secure
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Clinically Informed
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Evidence-Based
            </div>
          </div>
        </div>

        {/* Experience Selection */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Training Level
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the experience level that matches your current therapeutic practice to receive 
              the most appropriate patient simulation.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Experienced Therapist Card */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group bg-gradient-to-br from-white to-blue-50"
                  onClick={() => handleExperienceSelect("experienced")}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-medium">
                    Recommended for Professionals
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Experienced Therapist
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  You have substantial experience in therapeutic practice and are comfortable 
                  handling various client presentations and therapeutic challenges.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center mb-3">
                    <Heart className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-800">Patient Profile: Alex</h4>
                  </div>
                  <p className="text-green-700 text-sm mb-3">
                    A motivated client who is ready to engage in therapeutic work and demonstrates 
                    good insight into their presenting concerns.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-green-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                      Receptive to therapeutic interventions and feedback
                    </div>
                    <div className="flex items-center text-sm text-green-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                      Demonstrates good emotional regulation skills
                    </div>
                    <div className="flex items-center text-sm text-green-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                      Active participant in therapeutic process
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  Begin Professional Session
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* New Therapist Card */}
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group bg-gradient-to-br from-white to-orange-50"
                  onClick={() => handleExperienceSelect("new")}>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 font-medium">
                    Skill Building Focus
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Developing Therapist
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  You're newer to therapeutic practice or want to develop skills for working 
                  with more challenging client presentations and complex dynamics.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center mb-3">
                    <Target className="h-5 w-5 text-orange-600 mr-2" />
                    <h4 className="font-semibold text-orange-800">Patient Profile: Jordan</h4>
                  </div>
                  <p className="text-orange-700 text-sm mb-3">
                    A complex client who presents with resistance, ambivalence, and challenging 
                    interpersonal dynamics that require advanced therapeutic skills.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-orange-700">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></div>
                      May exhibit resistance to therapeutic change
                    </div>
                    <div className="flex items-center text-sm text-orange-700">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></div>
                      Requires skillful navigation of defensive patterns
                    </div>
                    <div className="flex items-center text-sm text-orange-700">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></div>
                      Challenges therapeutic boundaries and rapport
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  Start Challenge Session
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose TherapySim?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides a comprehensive training environment designed 
              by mental health professionals for mental health professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Realistic Interactions</h4>
              <p className="text-gray-600 leading-relaxed">
                Engage with AI patients that respond authentically to your therapeutic interventions, 
                providing realistic practice scenarios.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Skill Enhancement</h4>
              <p className="text-gray-600 leading-relaxed">
                Practice and refine therapeutic techniques in a safe environment where mistakes 
                become valuable learning opportunities.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Adaptive Learning</h4>
              <p className="text-gray-600 leading-relaxed">
                Each session adapts to your responses and skill level, providing personalized 
                challenges that promote professional growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
