// server.js - Fixed version with better model handling
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// OpenRouter client setup
const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  console.warn('⚠️  OPENROUTER_API_KEY not found in environment variables');
  console.log('Will use mock responses only');
}

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001",
    "X-Title": "TherapySim Training Platform"
  }
});

// Try multiple models in order of preference
const MODELS_TO_TRY = [
  "meta-llama/llama-3.2-3b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free", 
  "deepseek/deepseek-r1:free",
  "qwen/qwen-2-7b-instruct:free"
];

// Patient prompts - simplified for better reliability
const PATIENT_PROMPTS = {
  experienced: {
    name: "Sam",
    systemPrompt: `You are Sam, a 30-year-old veteran with PTSD. You are cooperative and want to get better. You struggle with guilt from a combat incident. 

Respond as Sam would - brief, authentic, with some hesitation. Use natural speech like "umm", "..." and show you're trying to open up. Always provide a meaningful response to the therapist.

Example responses:
- "Thank you... it's hard to be here but I know I need help."
- "Yeah, I've been struggling since I got back. My fiancée thinks this might help."
- "I keep thinking about that day... wondering if I made the right choice."

Respond naturally to what the therapist says.`
  },
  new: {
    name: "Aisha", 
    systemPrompt: `You are Aisha, a 48-year-old woman with trust issues. You're defensive with therapists and don't believe therapy works. You're only here to see your grandchild more.

Respond as Aisha would - skeptical, challenging, but deep down wanting help. Show resistance but not complete hostility. Always provide a meaningful response.

Example responses:
- "Look, I've heard that before. How do I know you're any different?"
- "I'm only here because I have to be. My daughter says I need to 'work on myself.'"
- "You don't understand what I've been through."

Respond with skepticism to what the therapist says.`
  }
};

// Enhanced mock responses
const MOCK_RESPONSES = {
  experienced: [
    "Thank you... that means a lot. It's hard to be here, but I know I need to try something different.",
    "Yeah, my fiancée has been really supportive. She says I've been having nightmares and... I guess I have been.",
    "I keep thinking about that day, you know? What if those people in the car were just... trying to surrender?",
    "My faith used to help me through tough times, but now I'm not sure what to think about what I did.",
    "I want to get better. I really do. I just don't know if I can forgive myself for what happened.",
    "Sometimes I wake up in a cold sweat, thinking I can still hear the explosion...",
    "My family is proud of my service, but they don't understand the weight I carry from that mission."
  ],
  new: [
    "Look, I appreciate you saying that, but I've heard it all before. How do I know this time will be different?",
    "I'm here because I have to be, not because I want to be. My daughter says I need to 'work on myself.'",
    "You therapists all sound the same. 'I'm here to help.' Yeah, well, we'll see about that.",
    "I've been clean for nine months now, and everyone acts like I should be grateful. But some days... it's still hard.",
    "All I want is to see my grandbaby more. If that means sitting here talking to you, then fine.",
    "You don't know what it's like... growing up the way I did, the things that happened to me.",
    "I don't really trust people, especially people in authority. You understand that, right?"
  ]
};

let mockIndex = { experienced: 0, new: 0 };

// Function to try API with fallback to mock
async function getPatientResponse(message, patientType, chatHistory) {
  const patient = PATIENT_PROMPTS[patientType];
  
  if (API_KEY) {
    // Try each model until one works
    for (const model of MODELS_TO_TRY) {
      try {
        console.log(`🔄 Trying model: ${model}`);
        
        const messages = [
          { role: "system", content: patient.systemPrompt },
          ...chatHistory.slice(-4).map(msg => ({
            role: msg.sender === 'therapist' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: "user", content: message }
        ];

        console.log(`📝 Sending to ${model}:`, {
          messageCount: messages.length,
          lastUserMessage: message
        });

        // Try non-streaming first for reliability
        const completion = await client.chat.completions.create({
          model: model,
          messages: messages,
          max_tokens: 150,
          temperature: 0.8,
          stream: false
        });

        const response = completion.choices[0]?.message?.content?.trim();
        console.log(`📦 Raw response from ${model}:`, response);

        if (response && response.length > 0) {
          console.log(`✅ Success with ${model}: "${response}"`);
          return response;
        } else {
          console.log(`❌ Empty response from ${model}, trying next...`);
        }

      } catch (error) {
        console.log(`❌ ${model} failed:`, error.message);
        continue;
      }
    }
    
    console.log('❌ All models failed, using mock response');
  }

  // Fallback to mock response
  const responses = MOCK_RESPONSES[patientType];
  const mockResponse = responses[mockIndex[patientType] % responses.length];
  mockIndex[patientType]++;
  console.log(`🎭 Using mock response: "${mockResponse}"`);
  
  return mockResponse;
}

// Chat endpoint - simplified and more reliable
app.post('/api/chat', async (req, res) => {
  console.log('📨 Received chat request');
  
  try {
    const { message, patientType, chatHistory = [] } = req.body;
    
    console.log(`👨‍⚕️ Therapist: "${message}"`);
    console.log(`🎭 Patient type: ${patientType}`);

    if (!message || !patientType) {
      return res.status(400).json({ error: 'Message and patient type are required' });
    }

    const patient = PATIENT_PROMPTS[patientType];
    if (!patient) {
      return res.status(400).json({ error: 'Invalid patient type' });
    }

    // Get response (either from API or mock)
    const response = await getPatientResponse(message, patientType, chatHistory);

    // Set up streaming response for better UX
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Simulate typing for better user experience
    const words = response.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isLastWord = i === words.length - 1;
      
      // Add space before word (except first word)
      if (i > 0) {
        currentText += ' ';
        res.write(`data: ${JSON.stringify({ content: ' ' })}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // Send the word
      currentText += word;
      res.write(`data: ${JSON.stringify({ content: word })}\n\n`);
      
      // Longer pause after punctuation for more natural rhythm
      const hasEndPunctuation = /[.!?]$/.test(word);
      const hasCommaPunctuation = /[,;:]$/.test(word);
      
      if (hasEndPunctuation) {
        await new Promise(resolve => setTimeout(resolve, 400)); // Longer pause after sentences
      } else if (hasCommaPunctuation) {
        await new Promise(resolve => setTimeout(resolve, 200)); // Medium pause after commas
      } else if (isLastWord) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Short pause before completion
      } else {
        await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 40)); // Normal typing speed
      }
    }

    res.write(`data: ${JSON.stringify({ done: true, fullResponse: response })}\n\n`);
    res.end();
    
    console.log(`🤖 ${patient.name}: "${response}"`);

  } catch (error) {
    console.error('💥 Server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    apiKey: API_KEY ? 'configured' : 'missing'
  });
});

// Enhanced test endpoint
app.get('/api/test', async (req, res) => {
  if (!API_KEY) {
    return res.json({ status: 'No API key - using mock responses' });
  }

  const results = [];
  
  for (const model of MODELS_TO_TRY) {
    try {
      console.log(`🧪 Testing ${model}...`);
      const test = await client.chat.completions.create({
        model: model,
        messages: [
          { 
            role: "system", 
            content: "You are a helpful assistant. Always respond with actual content." 
          },
          { 
            role: "user", 
            content: "Say hello and tell me you're working. Be brief." 
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
        stream: false
      });
      
      const response = test.choices[0]?.message?.content?.trim() || '';
      console.log(`🧪 ${model} response:`, response);
      
      results.push({
        model: model,
        status: response ? 'working' : 'empty response',
        response: response,
        usage: test.usage
      });
      
    } catch (error) {
      console.log(`🧪 ${model} failed:`, error.message);
      results.push({
        model: model,
        status: 'failed',
        error: error.message
      });
    }
  }

  res.json({ 
    status: 'API test complete',
    results: results,
    fallback: 'Mock responses available'
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`🔍 Health: http://localhost:${port}/api/health`);
  console.log(`🧪 Test: http://localhost:${port}/api/test`);
  console.log(`🔑 API Key: ${API_KEY ? '✅ Configured' : '❌ Missing'}`);
});