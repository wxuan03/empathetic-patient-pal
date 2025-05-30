
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft, User, Bot, Clock, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "therapist" | "patient";
  timestamp: Date;
}

interface ChatInterfaceProps {
  patientType: string;
  onBack: () => void;
}

const ChatInterface = ({ patientType, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const patientInfo = {
    experienced: {
      name: "Alex Chen",
      type: "Cooperative Client",
      description: "Motivated individual seeking support for anxiety management",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      avatar: "AC",
      bgGradient: "from-emerald-50 to-blue-50"
    },
    new: {
      name: "Jordan Martinez",
      type: "Complex Presentation", 
      description: "Challenging client with resistance and interpersonal difficulties",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      avatar: "JM",
      bgGradient: "from-amber-50 to-orange-50"
    }
  };

  const currentPatient = patientInfo[patientType as keyof typeof patientInfo];

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize with patient greeting
  useEffect(() => {
    const initialMessage: Message = {
      id: "1",
      content: patientType === "experienced" 
        ? "Hello, I'm Alex. Thank you for making time to meet with me today. I've been struggling with anxiety, especially around work presentations, and it's really starting to impact my daily life. I'm hoping we can work together to find some strategies that might help me manage these feelings better."
        : "Hi... I'm Jordan. Look, I'm only here because my supervisor said I had to come. I don't really buy into this whole therapy thing, honestly. I've tried talking to people before and it never really goes anywhere. But I guess I'm here now, so... what do you want to know?",
      sender: "patient",
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [patientType]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const therapistMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "therapist",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, therapistMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    try {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
      
      const patientResponse = generatePatientResponse(inputValue, patientType);
      
      const patientMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: patientResponse,
        sender: "patient",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, patientMessage]);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the patient simulation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePatientResponse = (therapistInput: string, type: string): string => {
    const easyResponses = [
      "That's really insightful. I hadn't considered that perspective before. It makes me think about how I might be contributing to my own anxiety in some ways.",
      "I appreciate you asking that question. It helps me feel like you're really listening and trying to understand what I'm going through.",
      "Yes, I think that approach could be really helpful. How would you suggest I start implementing something like that in my daily routine?",
      "I've been noticing that pattern too, actually. It's something I'd definitely like to work on changing, but I'm not sure where to begin.",
      "Thank you for being so patient with me as I work through this. I'm starting to feel more hopeful about making some positive changes."
    ];

    const hardResponses = [
      "I don't see how that's supposed to help me. That's basically the same thing everyone else has told me. Don't you have anything new to offer?",
      "You therapists all say the same things. You don't really understand what it's like to be in my situation, do you?",
      "I've tried that approach before and it was a complete waste of time. Nothing you're suggesting is going to work for me.",
      "Whatever. I guess we can talk about it if you insist, but I don't think any of this is going to make a real difference in my life.",
      "I don't know why I even bother coming to these sessions. This isn't going to change anything about my problems."
    ];

    const responses = type === "experienced" ? easyResponses : hardResponses;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentPatient.bgGradient} relative`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            End Session
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
              Therapy Session
            </h1>
            <div className="flex items-center justify-center mt-1 space-x-4">
              <Badge className={currentPatient.color}>
                {currentPatient.type}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(sessionDuration)}
              </div>
            </div>
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Enhanced Patient Info Card */}
        <Card className="mb-6 border-0 shadow-xl bg-white/90 backdrop-blur-md overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${patientType === 'experienced' ? 'from-emerald-500 to-blue-500' : 'from-amber-500 to-orange-500'}`}></div>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-14 w-14 mr-4 shadow-lg ring-4 ring-white">
                  <AvatarFallback className={`text-lg font-bold ${patientType === 'experienced' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {currentPatient.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl text-gray-900">{currentPatient.name}</CardTitle>
                  <p className="text-gray-600 mt-1">{currentPatient.description}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs font-medium">
                  {messages.length} exchanges
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Enhanced Chat Interface */}
        <Card className="h-[600px] flex flex-col border-0 shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-800">Session Conversation</CardTitle>
              <div className="flex items-center space-x-2">
                {isLoading && (
                  <div className="flex items-center text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    Patient is typing...
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Enhanced Messages Area */}
            <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-4 ${
                      message.sender === "therapist" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0 shadow-md">
                      <AvatarFallback className={
                        message.sender === "therapist" 
                          ? "bg-blue-100 text-blue-700 font-semibold" 
                          : `${patientType === 'experienced' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} font-semibold`
                      }>
                        {message.sender === "therapist" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex-1 max-w-md ${
                      message.sender === "therapist" ? "text-right" : ""
                    }`}>
                      <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                        message.sender === "therapist"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                      }`}>
                        {message.content}
                      </div>
                      <div className={`text-xs text-gray-500 mt-2 ${message.sender === "therapist" ? "text-right" : ""}`}>
                        <span className="font-medium">
                          {message.sender === "therapist" ? "You" : currentPatient.name}
                        </span>
                        <span className="mx-1">•</span>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10 shadow-md">
                      <AvatarFallback className={`${patientType === 'experienced' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} font-semibold`}>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Enhanced Input Area */}
            <div className="border-t border-gray-100 p-6 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex space-x-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your therapeutic response..."
                  className="flex-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl px-4 py-3 text-base"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-3 flex items-center justify-center">
                Press Enter to send • Maintain professional boundaries • Practice active listening
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
