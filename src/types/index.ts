export interface Account {
  id: string;
  email: string;
  password: string;
  recoveryEmail: string;
  createdAt: string;
  status: 'success' | 'failed' | 'pending';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface Config {
  captcha: {
    apiKey: string;
    balance?: number;
  };
  proxy: {
    host: string;
    port: string;
    username: string;
    password: string;
  };
  account: {
    recoveryEmail: string;
    domain: '@outlook.com' | '@hotmail.com';
    passwordLength: number;
  };
}

export interface ServerStatus {
  online: boolean;
  uptime: string;
  activeJobs: number;
  queueLength: number;
}

export interface Stats {
  totalAccounts: number;
  todayAccounts: number;
  successRate: number;
  failedToday: number;
}
