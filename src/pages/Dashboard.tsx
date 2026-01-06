import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Activity,
  Server
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

// Demo data
const stats = {
  totalAccounts: 1247,
  todayAccounts: 23,
  successRate: 94.5,
  failedToday: 2,
};

const serverStatus = {
  online: true,
  uptime: '5d 12h 34m',
  activeJobs: 2,
  queueLength: 5,
};

const recentLogs = [
  { id: '1', type: 'success', message: 'Account created: outlook_user_847@outlook.com', time: '2 min ago' },
  { id: '2', type: 'success', message: 'Account created: hotmail_pro_123@hotmail.com', time: '5 min ago' },
  { id: '3', type: 'error', message: 'Captcha solving failed - retrying...', time: '8 min ago' },
  { id: '4', type: 'info', message: 'Proxy rotated to new IP', time: '12 min ago' },
  { id: '5', type: 'success', message: 'Account created: user_temp_456@outlook.com', time: '15 min ago' },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your account creation activity</p>
        </div>

        {/* Server Status */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${serverStatus.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <div>
                  <p className="font-medium text-foreground">Server Status</p>
                  <p className="text-sm text-muted-foreground">
                    {serverStatus.online ? 'Online' : 'Offline'} • Uptime: {serverStatus.uptime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Active Jobs</p>
                  <p className="font-bold text-primary">{serverStatus.activeJobs}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Queue</p>
                  <p className="font-bold text-foreground">{serverStatus.queueLength}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Accounts
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalAccounts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time created</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Accounts
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.todayAccounts}</div>
              <p className="text-xs text-muted-foreground">Created today</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Success Rate
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Failed Today
              </CardTitle>
              <XCircle className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.failedToday}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={log.type === 'success' ? 'default' : log.type === 'error' ? 'destructive' : 'secondary'}
                      className={log.type === 'success' ? 'bg-green-500/20 text-green-500' : ''}
                    >
                      {log.type}
                    </Badge>
                    <span className="text-sm text-foreground">{log.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
