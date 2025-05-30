
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft, User, Bot, AlertCircle } from "lucide-react";
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const patientInfo = {
    experienced: {
      name: "Alex",
      type: "Easy to Handle Patient",
      description: "Cooperative and motivated to make progress",
      color: "bg-green-100 text-green-800",
      avatar: "A"
    },
    new: {
      name: "Jordan",
      type: "Hard to Work With Patient", 
      description: "Challenging and requires advanced therapeutic skills",
      color: "bg-orange-100 text-orange-800",
      avatar: "J"
    }
  };

  const currentPatient = patientInfo[patientType as keyof typeof patientInfo];

  // Initialize with patient greeting
  useEffect(() => {
    const initialMessage: Message = {
      id: "1",
      content: patientType === "experienced" 
        ? "Hello, I'm Alex. I've been looking forward to our session today. I've been dealing with some anxiety lately and I'm hoping you can help me work through it."
        : "Hi... I'm Jordan. I'm only here because someone said I had to come. I don't really think this therapy stuff works, but whatever.",
      sender: "patient",
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, [patientType]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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

    // Simulate AI response (in real implementation, this would call the LLM API)
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
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
    // Simple response generator (in real implementation, this would be the LLM API call)
    const easyResponses = [
      "That's a really good point. I hadn't thought about it that way before.",
      "I appreciate you asking that. It makes me feel heard and understood.",
      "Yes, I think that could be helpful. How do you suggest I start?",
      "I've noticed that pattern too. It's something I'd like to work on.",
      "Thank you for being patient with me. This is really helping."
    ];

    const hardResponses = [
      "I don't see how that's supposed to help me. This is just like what everyone else says.",
      "You don't really get it, do you? It's not that simple.",
      "I've tried that before and it didn't work. Nothing really works for me.",
      "Whatever. I guess we can talk about it, but I don't think it'll make a difference.",
      "I don't know why I'm even here. This isn't going to change anything."
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Therapy Session</h1>
            <Badge className={currentPatient.color}>
              {currentPatient.type}
            </Badge>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Patient Info Card */}
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {currentPatient.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{currentPatient.name}</CardTitle>
                <p className="text-sm text-gray-600">{currentPatient.description}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Session Chat</CardTitle>
              <Badge variant="outline" className="text-xs">
                {messages.length} messages
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === "therapist" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={
                        message.sender === "therapist" 
                          ? "bg-blue-100 text-blue-600" 
                          : "bg-gray-100 text-gray-600"
                      }>
                        {message.sender === "therapist" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex-1 max-w-xs sm:max-w-md ${
                      message.sender === "therapist" ? "text-right" : ""
                    }`}>
                      <div className={`inline-block p-3 rounded-lg text-sm ${
                        message.sender === "therapist"
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}>
                        {message.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 p-3 rounded-lg rounded-bl-sm">
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

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response as the therapist..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Press Enter to send your message
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
