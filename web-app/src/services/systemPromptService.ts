
const API_BASE_URL = 'http://127.0.0.1:4327';

export interface SystemPromptResponse {
  system_prompt: string;
  updated?: boolean;
}

class SystemPromptService {
  async getCurrentPrompt(): Promise<SystemPromptResponse> {
    const response = await fetch(`${API_BASE_URL}/system-prompt`);
    if (!response.ok) {
      throw new Error(`Failed to get system prompt: ${response.statusText}`);
    }
    return response.json();
  }

  async updatePrompt(systemPrompt: string): Promise<SystemPromptResponse> {
    const response = await fetch(`${API_BASE_URL}/system-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ system_prompt: systemPrompt }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update system prompt: ${response.statusText}`);
    }
    return response.json();
  }
}

export const systemPromptService = new SystemPromptService();
