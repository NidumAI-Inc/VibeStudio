
const AUTH_BASE_URL = 'https://nativenode.link.nativenode.host:5633/api';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
  };
  _id?: string;
  isVerified?: boolean;
  error?: string;
}

class AuthService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  private async handleResponse(response: Response): Promise<AuthResponse> {
    const result = await response.json();
    
    // Check for invalid token responses
    if (!response.ok && (result.error === 'Invalid token' || result.message?.includes('Invalid token'))) {
      this.removeAuthToken();
      throw new Error('Invalid token');
    }
    
    return result;
  }

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/user/v2/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  async verifyOTP(request: VerifyOTPRequest): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/user/v2/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const result = await this.handleResponse(response);
    
    if (result.token) {
      this.setAuthToken(result.token);
    }
    
    return result;
  }

  async logout(): Promise<AuthResponse> {
    const token = this.getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${AUTH_BASE_URL}/user/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const result = await this.handleResponse(response);
        this.removeAuthToken();
        return result;
      } catch (error) {
        // Even if logout fails, remove token locally
        this.removeAuthToken();
        throw error;
      }
    }
    this.removeAuthToken();
    return { success: true, message: 'Logged out successfully' };
  }

  async resendOTP(email: string): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/user/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(response);
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/user/forget-pass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async resetPassword(request: ResetPasswordRequest): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/user/reset-pass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async updatePassword(request: UpdatePasswordRequest): Promise<AuthResponse> {
    const token = this.getAuthToken();
    const response = await fetch(`${AUTH_BASE_URL}/user/update-pass`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async deleteAccount(): Promise<AuthResponse> {
    const token = this.getAuthToken();
    const response = await fetch(`${AUTH_BASE_URL}/user/v2/account`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await this.handleResponse(response);
    this.removeAuthToken();
    return result;
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const authService = new AuthService();
