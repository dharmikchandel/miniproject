const axios = require('axios');

/**
 * List available Gemini models
 * Helper function to query the API for available models
 */
async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return [];
  }
  
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (response.data && response.data.models) {
      return response.data.models
        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name.replace('models/', ''));
    }
  } catch (error) {
    console.warn('[Gemini] Could not list available models:', error.message);
  }
  
  return [];
}

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

  // Determine model to use - try various common names
  let requestedModel = opts.model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  
  // List of models to try in order of preference
  const modelCandidates = [
    requestedModel,
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-2.0-flash-exp',
    'gemini-pro',
    'models/gemini-1.5-flash',
    'models/gemini-pro'
  ];
  
  // Remove duplicates and filter out deprecated models
  const uniqueModels = [...new Set(modelCandidates)].filter(m => 
    m && !m.includes('gemini-1.5-pro-latest')
  );
  
  let model = uniqueModels[0];
  
  console.log(`[Gemini] Requested model: ${requestedModel}`);
  console.log(`[Gemini] Attempting model: ${model}`);
  
  // Combine system prompt and user prompt for Gemini
  const systemPrompt = opts.systemPrompt || 'You are a helpful assistant that generates code and JSON responses. Return only the requested content without markdown fences or commentary.';
  const fullPrompt = `${systemPrompt}\n\n${prompt}`;
  
  const requestBody = {
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
  };
  
  const requestConfig = {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 60000 // 60 second timeout
  };
  
  try {
    // Try models in order until one works
    let lastError = null;
    
    for (const testModel of uniqueModels) {
      // Clean model name (remove 'models/' prefix if present)
      const cleanModel = testModel.replace(/^models\//, '');
      
      // Try both v1beta and v1 endpoints for each model
      const endpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1/models/${cleanModel}:generateContent?key=${apiKey}`
      ];
      
      for (const apiUrl of endpoints) {
        try {
          console.log(`[Gemini] Trying: ${apiUrl.split('/models/')[1]?.split(':')[0]}`);
          const response = await axios.post(apiUrl, requestBody, requestConfig);
          
          // Success! Use this model and response
          console.log(`[Gemini] Successfully using model: ${cleanModel}`);
          model = cleanModel;
          
          // Process the response
          let content = null;
          if (response.data.candidates && response.data.candidates[0]) {
            content = response.data.candidates[0]?.content?.parts?.[0]?.text;
          }
          
          // Check if response was blocked or filtered
          if (response.data.candidates?.[0]?.finishReason) {
            const finishReason = response.data.candidates[0].finishReason;
            if (finishReason !== 'STOP' && finishReason !== 'MAX_TOKENS') {
              throw new Error(`Gemini API response blocked: ${finishReason}`);
            }
          }
          
          if (!content) {
            console.error('Full Gemini API response:', JSON.stringify(response.data, null, 2));
            throw new Error('No content in Gemini API response. Check the API response structure.');
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
          // If it's not a 404, throw immediately (auth errors, etc.)
          if (error.response && error.response.status !== 404) {
            throw error;
          }
          // Store the last 404 error to show helpful message
          lastError = error;
        }
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error('All model attempts failed');

  } catch (error) {
    if (error.response) {
      const errorMsg = error.response.data?.error?.message || error.message;
      const status = error.response.status;
      
      // Provide helpful suggestions for common errors
      if (status === 404) {
        // Log the actual model used and the raw error message
        console.error(`[Gemini] 404 Error - Attempted models: ${uniqueModels.join(', ')}`);
        console.error(`[Gemini] Raw error message:`, errorMsg);
        
        // Try to list available models
        console.log(`[Gemini] Attempting to list available models...`);
        const availableModels = await listAvailableModels();
        
        let suggestion = '';
        if (availableModels.length > 0) {
          suggestion = `Available models: ${availableModels.slice(0, 5).join(', ')}. Try setting GEMINI_MODEL to one of these.`;
        } else {
          suggestion = errorMsg || 'No models found. Please check your API key and ensure it has access to Gemini models.';
        }
        
        throw new Error(`Gemini API error 404: None of the attempted models worked. ${suggestion}`);
      } else if (status === 400) {
        throw new Error(`Gemini API error 400: Bad request - ${errorMsg}. Check your prompt and API key.`);
      } else if (status === 401 || status === 403) {
        throw new Error(`Gemini API error ${status}: Authentication failed. Check your GEMINI_API_KEY.`);
      }
      
      throw new Error(`Gemini API error: ${status} - ${errorMsg}`);
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
  listAvailableModels,
  // Legacy exports for backward compatibility
  callCursor,
  callLovable, 
  callChatGPTProxy
};

