import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { Config } from '@/types';

export default function ConfigManagement() {
  const [config, setConfig] = useState<Config>({
    captcha: { apiKey: '', balance: 0 },
    proxy: { host: 'p.webshare.io', port: '80', username: '', password: '' },
    account: { recoveryEmail: '', domain: '@outlook.com', passwordLength: 12 },
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showProxyPass, setShowProxyPass] = useState(false);
  const [isTestingProxy, setIsTestingProxy] = useState(false);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleCheckBalance = async () => {
    if (!config.captcha.apiKey) {
      toast({
        title: "Error",
        description: "Please enter 2Captcha API key first",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingBalance(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const balance = Math.random() * 10;
    setConfig(prev => ({
      ...prev,
      captcha: { ...prev.captcha, balance }
    }));
    
    toast({
      title: "Balance checked",
      description: `Current balance: $${balance.toFixed(2)}`,
    });
    setIsCheckingBalance(false);
  };

  const handleTestProxy = async () => {
    if (!config.proxy.host || !config.proxy.username) {
      toast({
        title: "Error",
        description: "Please fill in proxy details first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingProxy(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.2;
    toast({
      title: success ? "Proxy Connected!" : "Proxy Failed",
      description: success ? "Connection successful" : "Could not connect to proxy",
      variant: success ? "default" : "destructive",
    });
    setIsTestingProxy(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Config Saved!",
      description: "Your settings have been updated",
    });
    setIsSaving(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuration</h1>
          <p className="text-muted-foreground">Manage your API keys and settings</p>
        </div>

        <div className="grid gap-6">
          {/* Captcha Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">2Captcha Settings</CardTitle>
              <CardDescription>Configure your captcha solving service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="Enter your 2Captcha API key"
                      value={config.captcha.apiKey}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        captcha: { ...prev.captcha, apiKey: e.target.value }
                      }))}
                      className="bg-secondary border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleCheckBalance}
                    disabled={isCheckingBalance}
                    className="border-border"
                  >
                    {isCheckingBalance ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              {config.captcha.balance !== undefined && config.captcha.balance > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">
                    Balance: ${config.captcha.balance.toFixed(2)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proxy Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Proxy Settings (Webshare.io)</CardTitle>
              <CardDescription>Configure your proxy connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proxyHost">Host</Label>
                  <Input
                    id="proxyHost"
                    placeholder="p.webshare.io"
                    value={config.proxy.host}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      proxy: { ...prev.proxy, host: e.target.value }
                    }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proxyPort">Port</Label>
                  <Input
                    id="proxyPort"
                    placeholder="80"
                    value={config.proxy.port}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      proxy: { ...prev.proxy, port: e.target.value }
                    }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proxyUser">Username</Label>
                  <Input
                    id="proxyUser"
                    placeholder="Username"
                    value={config.proxy.username}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      proxy: { ...prev.proxy, username: e.target.value }
                    }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proxyPass">Password</Label>
                  <div className="relative">
                    <Input
                      id="proxyPass"
                      type={showProxyPass ? 'text' : 'password'}
                      placeholder="Password"
                      value={config.proxy.password}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        proxy: { ...prev.proxy, password: e.target.value }
                      }))}
                      className="bg-secondary border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowProxyPass(!showProxyPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showProxyPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleTestProxy}
                disabled={isTestingProxy}
                className="border-border"
              >
                {isTestingProxy ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Account Settings</CardTitle>
              <CardDescription>Configure account creation preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recoveryEmail">Recovery Email</Label>
                <Input
                  id="recoveryEmail"
                  type="email"
                  placeholder="recovery@gmail.com"
                  value={config.account.recoveryEmail}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    account: { ...prev.account, recoveryEmail: e.target.value }
                  }))}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Email Domain</Label>
                  <Select 
                    value={config.account.domain} 
                    onValueChange={(value: '@outlook.com' | '@hotmail.com') => setConfig(prev => ({
                      ...prev,
                      account: { ...prev.account, domain: value }
                    }))}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="@outlook.com">@outlook.com</SelectItem>
                      <SelectItem value="@hotmail.com">@hotmail.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordLength">Password Length</Label>
                  <Input
                    id="passwordLength"
                    type="number"
                    min={8}
                    max={24}
                    value={config.account.passwordLength}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      account: { ...prev.account, passwordLength: parseInt(e.target.value) || 12 }
                    }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
