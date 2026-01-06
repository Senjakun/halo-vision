import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  UserPlus, 
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';

interface QueueItem {
  id: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email?: string;
  progress: number;
}

export default function AccountCreator() {
  const [batchCount, setBatchCount] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const { toast } = useToast();

  const handleSingleCreate = () => {
    const newItem: QueueItem = {
      id: Date.now().toString(),
      status: 'pending',
      progress: 0,
    };
    setQueue(prev => [...prev, newItem]);
    simulateCreation(newItem.id);
  };

  const handleBatchCreate = () => {
    const newItems: QueueItem[] = Array.from({ length: batchCount }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      status: 'pending' as const,
      progress: 0,
    }));
    setQueue(prev => [...prev, ...newItems]);
    setIsRunning(true);
    
    // Start processing queue
    newItems.forEach((item, index) => {
      setTimeout(() => simulateCreation(item.id), index * 3000);
    });
  };

  const simulateCreation = (itemId: string) => {
    // Update to processing
    setQueue(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'processing' as const } : item
    ));

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Random success/fail
        const success = Math.random() > 0.1;
        const email = success ? `user_${Math.random().toString(36).substr(2, 8)}@outlook.com` : undefined;
        
        setQueue(prev => prev.map(item => 
          item.id === itemId ? { 
            ...item, 
            status: success ? 'success' : 'failed',
            email,
            progress: 100
          } : item
        ));

        if (success) {
          toast({
            title: "Account Created!",
            description: email,
          });
        }
      } else {
        setQueue(prev => prev.map(item => 
          item.id === itemId ? { ...item, progress } : item
        ));
      }
    }, 500);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    toast({
      title: "Stopped",
      description: "Account creation stopped",
      variant: "destructive",
    });
  };

  const clearQueue = () => {
    setQueue([]);
    setIsRunning(false);
    setIsPaused(false);
  };

  const successCount = queue.filter(q => q.status === 'success').length;
  const failedCount = queue.filter(q => q.status === 'failed').length;
  const pendingCount = queue.filter(q => q.status === 'pending' || q.status === 'processing').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Account Creator</h1>
          <p className="text-muted-foreground">Create Microsoft accounts automatically</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Options */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Create Account</CardTitle>
              <CardDescription>Choose single or batch creation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Single Create */}
              <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                <h3 className="font-medium text-foreground">Single Account</h3>
                <p className="text-sm text-muted-foreground">Create one account instantly</p>
                <Button 
                  onClick={handleSingleCreate}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isRunning}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create One Account
                </Button>
              </div>

              {/* Batch Create */}
              <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                <h3 className="font-medium text-foreground">Batch Create</h3>
                <p className="text-sm text-muted-foreground">Create multiple accounts</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="batchCount" className="sr-only">Number of accounts</Label>
                    <Input
                      id="batchCount"
                      type="number"
                      min={1}
                      max={100}
                      value={batchCount}
                      onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                      className="bg-background border-border"
                      disabled={isRunning}
                    />
                  </div>
                  <Button 
                    onClick={handleBatchCreate}
                    className="bg-primary hover:bg-primary/90"
                    disabled={isRunning}
                  >
                    Start Batch
                  </Button>
                </div>
              </div>

              {/* Controls */}
              {queue.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePause}
                    disabled={!isRunning}
                    className="flex-1"
                  >
                    {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleStop}
                    disabled={!isRunning}
                    className="flex-1"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearQueue}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Queue Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center justify-between">
                <span>Queue Status</span>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                    {successCount} success
                  </Badge>
                  <Badge variant="destructive">
                    {failedCount} failed
                  </Badge>
                  <Badge variant="secondary">
                    {pendingCount} pending
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {queue.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No accounts in queue. Start creating!
                  </p>
                ) : (
                  queue.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-3 rounded-lg bg-secondary/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.status === 'processing' && (
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          )}
                          {item.status === 'success' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {item.status === 'failed' && (
                            <XCircle className="w-4 h-4 text-destructive" />
                          )}
                          {item.status === 'pending' && (
                            <Clock className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-sm text-foreground">
                            {item.email || `Account #${item.id.slice(-4)}`}
                          </span>
                        </div>
                        <Badge 
                          variant={
                            item.status === 'success' ? 'default' : 
                            item.status === 'failed' ? 'destructive' : 
                            'secondary'
                          }
                          className={item.status === 'success' ? 'bg-green-500/20 text-green-500' : ''}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      {item.status === 'processing' && (
                        <Progress value={item.progress} className="h-1" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
