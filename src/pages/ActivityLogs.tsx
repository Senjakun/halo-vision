import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { LogEntry } from '@/types';

// Demo logs
const generateDemoLogs = (): LogEntry[] => {
  const types: LogEntry['type'][] = ['success', 'error', 'info', 'warning'];
  const messages = {
    success: [
      'Account created successfully: user_abc123@outlook.com',
      'Captcha solved in 12.5 seconds',
      'Proxy connection established',
      'Email verification completed',
    ],
    error: [
      'Captcha solving failed - timeout',
      'Proxy connection refused',
      'Rate limit exceeded - waiting 60s',
      'Account creation blocked - IP flagged',
    ],
    info: [
      'Starting new account creation',
      'Rotating to new proxy IP',
      'Checking captcha balance',
      'Queue processing started',
    ],
    warning: [
      'Low captcha balance: $1.50',
      'Proxy response time slow: 2.5s',
      'Multiple retries required',
      'Session cookie expired',
    ],
  };

  return Array.from({ length: 100 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const typeMessages = messages[type];
    return {
      id: `log-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      type,
      message: typeMessages[Math.floor(Math.random() * typeMessages.length)],
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export default function ActivityLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(generateDemoLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Add new random log
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: ['success', 'info', 'warning', 'error'][Math.floor(Math.random() * 4)] as LogEntry['type'],
        message: 'New activity detected...',
      };
      setLogs(prev => [newLog, ...prev.slice(0, 99)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleClear = () => {
    setLogs([]);
    toast({
      title: "Logs cleared",
      description: "All logs have been removed",
    });
  };

  const handleRefresh = () => {
    setLogs(generateDemoLogs());
    toast({
      title: "Logs refreshed",
      description: "Fetched latest logs",
    });
  };

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBadgeVariant = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-500';
      case 'error':
        return 'bg-destructive/20 text-destructive';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-blue-500/20 text-blue-500';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
            <p className="text-muted-foreground">{filteredLogs.length} logs</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh" className="text-sm text-muted-foreground">
                Auto-refresh
              </Label>
            </div>
            <Button variant="outline" onClick={handleRefresh} className="border-border">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px] bg-secondary border-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No logs found
                </p>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    {getIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{log.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge className={getBadgeVariant(log.type)}>
                      {log.type}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
