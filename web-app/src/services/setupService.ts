
import { BASE_URL } from './config';
import { SetupCredentials } from './types';

export class SetupService {
  async setupCredentials(credentials: SetupCredentials) {
    const response = await fetch(`${BASE_URL}/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw data;
    }
    
    return data;
  }

  async getSetupCredentials() {
    const response = await fetch(`${BASE_URL}/setup`);
    const data = await response.json();
    
    if (!response.ok) {
      throw data;
    }
    
    return data;
  }

  async updateEnvironmentVariables(envVars: Record<string, string>) {
    const response = await fetch(`${BASE_URL}/env`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envVars),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw data;
    }
    
    return data;
  }

  async getEnvironmentVariables() {
    const response = await fetch(`${BASE_URL}/env`);
    const data = await response.json();
    
    if (!response.ok) {
      throw data;
    }
    
    return data;
  }
}

export const setupService = new SetupService();
