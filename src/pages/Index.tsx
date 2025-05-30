
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, MessageCircle, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">TherapySim</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice your therapy skills with AI-powered patient simulations tailored to your experience level
          </p>
        </div>

        {/* Experience Selection Cards */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            What's your experience level with therapy?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Experienced Therapist Card */}
            <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                  onClick={() => handleExperienceSelect("experienced")}>
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center mb-2">
                  <GraduationCap className="h-6 w-6 mr-3" />
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Experienced
                  </Badge>
                </div>
                <CardTitle className="text-xl">Seasoned Therapist</CardTitle>
                <CardDescription className="text-blue-100">
                  You have experience working with patients and handling therapeutic sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">You'll work with:</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    <strong>"Easy to Handle" Patient</strong> - A cooperative patient who is ready to engage and make progress
                  </p>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Responsive to therapeutic interventions
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Open to feedback and suggestions
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Motivated to change
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700 transition-colors">
                  Start Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* New Therapist Card */}
            <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                  onClick={() => handleExperienceSelect("new")}>
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <div className="flex items-center mb-2">
                  <Users className="h-6 w-6 mr-3" />
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    New to Therapy
                  </Badge>
                </div>
                <CardTitle className="text-xl">New Therapist</CardTitle>
                <CardDescription className="text-orange-100">
                  You're new to therapy or want to practice with challenging scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">You'll work with:</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    <strong>"Hard to Work With" Patient</strong> - A more challenging patient who requires advanced therapeutic skills
                  </p>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Resistant to change
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    May be defensive or guarded
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Requires patience and skill
                  </div>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700 group-hover:bg-orange-700 transition-colors">
                  Start Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Realistic Conversations</h3>
              <p className="text-sm text-gray-600">Engage with AI patients that respond naturally to your therapeutic approach</p>
            </div>
            <div className="p-4">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Skill Development</h3>
              <p className="text-sm text-gray-600">Practice different therapeutic techniques in a safe, controlled environment</p>
            </div>
            <div className="p-4">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Adaptive Learning</h3>
              <p className="text-sm text-gray-600">Each session adapts to your responses and provides personalized challenges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
