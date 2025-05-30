import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  ArrowLeft,
  User,
  Bot,
  Clock,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
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
  const [streamingMessage, setStreamingMessage] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const API_BASE_URL = "http://localhost:3001/api";

  const patientInfo = {
    experienced: {
      name: "Sam",
      type: "Cooperative Veteran",
      description: "Combat veteran with PTSD from drone operations",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      avatar: "SM",
      bgGradient: "from-emerald-50 to-blue-50",
    },
    new: {
      name: "Aisha",
      type: "Complex Trauma Survivor",
      description:
        "Survivor of multiple traumas with trust issues and resistance",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      avatar: "AS",
      bgGradient: "from-amber-50 to-orange-50",
    },
  };

  const currentPatient = patientInfo[patientType as keyof typeof patientInfo];

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize with patient greeting
  useEffect(() => {
    const initialMessage: Message = {
      id: "1",
      content:
        patientType === "experienced"
          ? "Hello... thank you for seeing me today. I'm Sam. I've been struggling since I got back from deployment, and my fiancée thinks talking to someone might help. I'm not really sure where to start, but... I guess I'm here now."
          : "Hi... I'm Aisha. Look, I'm only here because I need to show I'm trying to get better if I want to see my grandbaby more. I've tried this therapy thing before and... well, let's just say it didn't work out so well. But I guess we can try again.",
      sender: "patient",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [patientType]);

  // Improved auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const therapistMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "therapist",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, therapistMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);
    setStreamingMessage("");
    setApiError(null);

    console.log("Sending message:", currentInput);

    try {
      // Prepare chat history for API
      const chatHistory = messages.map((msg) => ({
        sender: msg.sender,
        content: msg.content,
      }));

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          patientType,
          chatHistory: [
            ...chatHistory,
            { sender: "therapist", content: currentInput },
          ],
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is streaming (Server-Sent Events)
      const contentType = response.headers.get("content-type");
      console.log("Content type:", contentType);

      if (contentType?.includes("text/event-stream")) {
        console.log("Processing streaming response...");

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));
                  console.log("Streaming data:", data);

                  if (data.content) {
                    fullResponse += data.content;
                    setStreamingMessage(fullResponse);
                  } else if (data.done && data.fullResponse) {
                    console.log("Stream complete:", data.fullResponse);
                    // Create final message
                    const patientMessage: Message = {
                      id: (Date.now() + 1).toString(),
                      content: data.fullResponse,
                      sender: "patient",
                      timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, patientMessage]);
                    setStreamingMessage("");
                    setIsLoading(false);
                    return; // Exit the function here
                  }
                } catch (e) {
                  console.warn("Failed to parse SSE data:", line, e);
                }
              }
            }
          }
        }
      } else {
        // Handle regular JSON response (fallback)
        console.log("Processing JSON response...");
        const data = await response.json();
        console.log("JSON data:", data);

        if (data.content || data.message) {
          const patientMessage: Message = {
            id: (Date.now() + 1).toString(),
            content:
              data.content ||
              data.message ||
              "I'm having trouble responding right now.",
            sender: "patient",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, patientMessage]);
        }
      }
    } catch (error: any) {
      console.error("Chat API Error:", error);
      setApiError(error.message);

      // Fallback to a simple mock response
      const fallbackResponses = {
        experienced: [
          "That's... that's really meaningful to hear. Thank you for saying that.",
          "I appreciate your patience with me. This is harder than I thought it would be.",
          "Yeah, I've been struggling with that. My fiancée says I should talk about it more.",
          "Sometimes I feel like I can't forgive myself for what happened over there.",
          "I want to get better. I really do. It's just... difficult, you know?",
        ],
        new: [
          "Look, I've heard that before. How do I know you're not just saying what you think I want to hear?",
          "I don't really trust therapists. You all seem to say the same things.",
          "I'm only here because I have to be. My daughter says I need to 'work on myself.'",
          "You don't know what I've been through. How could you possibly help me?",
          "All I want is to see my grandbaby. If sitting here helps with that, fine.",
        ],
      };

      const responses =
        fallbackResponses[patientType as keyof typeof fallbackResponses];
      const fallbackResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setTimeout(() => {
        const patientMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: fallbackResponse,
          sender: "patient",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, patientMessage]);
      }, 1000);

      toast({
        title: "Connection Issue",
        description:
          "Using offline mode. Check backend server for full AI responses.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentPatient.bgGradient} relative`}
    >
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
              {apiError && (
                <div className="flex items-center text-sm text-orange-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Offline Mode
                </div>
              )}
            </div>
          </div>

          <div className="w-24"></div>
        </div>

        {/* Enhanced Patient Info Card */}
        <Card className="mb-6 border-0 shadow-xl bg-white/90 backdrop-blur-md overflow-hidden">
          <div
            className={`h-2 bg-gradient-to-r ${
              patientType === "experienced"
                ? "from-emerald-500 to-blue-500"
                : "from-amber-500 to-orange-500"
            }`}
          ></div>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-14 w-14 mr-4 shadow-lg ring-4 ring-white">
                  <AvatarFallback
                    className={`text-lg font-bold ${
                      patientType === "experienced"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {currentPatient.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    {currentPatient.name}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {currentPatient.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-xs font-medium">
                  {Math.floor(messages.length / 2)} exchanges
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Enhanced Chat Interface */}
        <Card className="h-[600px] flex flex-col border-0 shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-800">
                Session Conversation
              </CardTitle>
              <div className="flex items-center space-x-2">
                {(isLoading || streamingMessage) && (
                  <div className="flex items-center text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    {currentPatient.name} is responding...
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Enhanced Messages Area with better scrolling */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 ${
                    message.sender === "therapist"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <Avatar className="h-10 w-10 flex-shrink-0 shadow-md">
                    <AvatarFallback
                      className={
                        message.sender === "therapist"
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : `${
                              patientType === "experienced"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            } font-semibold`
                      }
                    >
                      {message.sender === "therapist" ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`flex-1 max-w-md ${
                      message.sender === "therapist" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                        message.sender === "therapist"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-2 ${
                        message.sender === "therapist" ? "text-right" : ""
                      }`}
                    >
                      <span className="font-medium">
                        {message.sender === "therapist"
                          ? "You"
                          : currentPatient.name}
                      </span>
                      <span className="mx-1">•</span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming message display */}
              {streamingMessage && (
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10 shadow-md">
                    <AvatarFallback
                      className={`${
                        patientType === "experienced"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      } font-semibold`}
                    >
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 max-w-md">
                    <div className="inline-block p-4 rounded-2xl rounded-bl-md text-sm leading-relaxed shadow-md bg-white text-gray-800 border border-gray-200">
                      {streamingMessage}
                      <span className="animate-pulse ml-1 text-blue-500">
                        |
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading indicator for non-streaming */}
              {isLoading && !streamingMessage && (
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10 shadow-md">
                    <AvatarFallback
                      className={`${
                        patientType === "experienced"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      } font-semibold`}
                    >
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

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
                Press Enter to send • Practice therapeutic responses •{" "}
                {apiError
                  ? "Backend needed for full AI responses"
                  : "Connected to AI patient simulation"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
