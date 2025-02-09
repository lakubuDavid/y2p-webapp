import { User, UserCredentials } from './types';

export class ApiClient {
  private baseUrl: string;
  private storage: Storage;
  private credentials: UserCredentials = {};

  constructor(baseUrl: string, storage: Storage = localStorage) {
    this.baseUrl = baseUrl;
    this.storage = storage;
    this.loadCredentials();
  }

  private loadCredentials() {
    const stored = this.storage.getItem('auth');
    if (stored) {
      this.credentials = JSON.parse(stored);
    }
  }

  private saveCredentials(credentials: UserCredentials) {
    this.credentials = credentials;
    this.storage.setItem('auth', JSON.stringify(credentials));
  }

  private clearCredentials() {
    this.credentials = {};
    this.storage.removeItem('auth');
  }

  public async login(email: string, password: string): Promise<UserCredentials> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const credentials = await response.json();
    this.saveCredentials(credentials);
    return credentials;
  }

  public async signup(email: string, password: string, name: string): Promise<UserCredentials> {
    const response = await fetch(`${this.baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    const credentials = await response.json();
    this.saveCredentials(credentials);
    return credentials;
  }

  public async refreshToken(): Promise<UserCredentials> {
    if (!this.credentials.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.credentials.refreshToken }),
    });

    if (!response.ok) {
      this.clearCredentials();
      throw new Error('Token refresh failed');
    }

    const newCredentials = await response.json();
    this.saveCredentials({
      ...this.credentials,
      ...newCredentials,
    });
    return this.credentials;
  }

  public async logout(): Promise<void> {
    if (!this.credentials.accessToken) return;

    try {
      await fetch(`${this.baseUrl}/auth/protected/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
          'x-refresh-token': this.credentials.refreshToken ?? "",
        },
      });
    } finally {
      this.clearCredentials();
    }
  }

  public async logoutAll(): Promise<void> {
    if (!this.credentials.accessToken) return;

    try {
      await fetch(`${this.baseUrl}/auth/protected/logout-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`,
        },
      });
    } finally {
      this.clearCredentials();
    }
  }

  public getUser(): User | undefined {
    return this.credentials.user;
  }

  public isAuthenticated(): boolean {
    return !!this.credentials.accessToken;
  }

  public async fetchWithAuth(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
    if (!this.credentials.accessToken) {
      throw new Error('Not authenticated');
    }

    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${this.credentials.accessToken}`);

    const response = await fetch(input, { ...init, headers });

    if (response.status === 401) {
      // Token might be expired, try to refresh
      try {
        await this.refreshToken();
        // Retry the request with new token
        headers.set('Authorization', `Bearer ${this.credentials.accessToken}`);
        return fetch(input, { ...init, headers });
      } catch {
        this.clearCredentials();
        throw new Error('Authentication failed');
      }
    }

    return response;
  }
}
