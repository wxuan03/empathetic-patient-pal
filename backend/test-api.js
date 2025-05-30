// test-api.js - Quick test script for OpenRouter API
import { OpenAI } from 'openai';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001",
    "X-Title": "TherapySim Training Platform"
  }
});

async function testAPI() {
  console.log('Testing OpenRouter API connection...');
  
  try {
    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Respond briefly."
        },
        {
          role: "user",
          content: "Say hello and confirm you're working."
        }
      ],
      max_tokens: 50,
      temperature: 0.7
    });

    console.log('✅ API connection successful!');
    console.log('Response:', completion.choices[0]?.message?.content);
    
  } catch (error) {
    console.log('❌ API connection failed:');
    console.log('Error:', error.message);
    console.log('Status:', error.status);
    
    if (error.status === 401) {
      console.log('\n🔑 Authentication issue - the API key might be expired or invalid');
      console.log('The server will fall back to mock responses for the demo');
    }
  }
}

testAPI();