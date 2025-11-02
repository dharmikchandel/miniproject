const axios = require('axios');

/**
 * Google Gemini AI Adapter
 * Uses Google Gemini API for code and text generation
 * Requires GEMINI_API_KEY environment variable
 */
async function callGemini(prompt, opts = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  // Use Gemini API endpoint
  const model = opts.model || process.env.GEMINI_MODEL || 'gemini-pro';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  // Combine system prompt and user prompt for Gemini
  const systemPrompt = opts.systemPrompt || 'You are a helpful assistant that generates code and JSON responses. Return only the requested content without markdown fences or commentary.';
  const fullPrompt = `${systemPrompt}\n\n${prompt}`;
  
  try {
    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: opts.temperature || 0.7,
          maxOutputTokens: opts.maxTokens || 2000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No content in Gemini API response');
    }

    // Clean up response - remove markdown code fences if present
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      const lines = cleaned.split('\n');
      // Remove first line (```language) and last line (```)
      cleaned = lines.slice(1, -1).join('\n').trim();
    }

    return cleaned;
  } catch (error) {
    if (error.response) {
      const errorMsg = error.response.data?.error?.message || error.message;
      throw new Error(`Gemini API error: ${error.response.status} - ${errorMsg}`);
    }
    throw new Error(`Gemini API request failed: ${error.message}`);
  }
}

/**
 * Fallback adapter for alternative AI providers (optional)
 * Currently not implemented - reserved for future use
 */
async function callGeminiFallback(prompt, opts = {}) {
  // Reserved for future fallback providers
  // For now, this just throws an error and uses Gemini as primary
  throw new Error('Fallback provider not configured - using Gemini only');
}

/**
 * Main function to call Gemini AI
 * This is the primary interface used by the application
 */
async function callPreferred(prompt, opts = {}) {
  // Use Gemini API as the primary and only provider
  try {
    return await callGemini(prompt, opts);
  } catch (e1) {
    // If Gemini fails, try fallback (if configured)
    try {
      return await callGeminiFallback(prompt, opts);
    } catch (e2) {
      // If all adapters fail, throw comprehensive error
      throw new Error(`Gemini API call failed: ${e1.message}`);
    }
  }
}

// Legacy function names for backward compatibility (deprecated)
const callCursor = callGemini;
const callLovable = callGeminiFallback;
const callChatGPTProxy = callGeminiFallback;

module.exports = { 
  callGemini, 
  callPreferred,
  // Legacy exports for backward compatibility
  callCursor,
  callLovable, 
  callChatGPTProxy
};

