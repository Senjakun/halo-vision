import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Copy, 
  Download, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { Account } from '@/types';

// Demo data
const demoAccounts: Account[] = Array.from({ length: 50 }, (_, i) => ({
  id: `acc-${i + 1}`,
  email: `user_${Math.random().toString(36).substr(2, 8)}@${Math.random() > 0.5 ? 'outlook' : 'hotmail'}.com`,
  password: `Pass${Math.random().toString(36).substr(2, 10)}!`,
  recoveryEmail: 'recovery@gmail.com',
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  status: Math.random() > 0.1 ? 'success' : 'failed',
}));

export default function AccountViewer() {
  const [accounts] = useState<Account[]>(demoAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const itemsPerPage = 10;

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedAccounts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedAccounts.map(a => a.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const copyCredentials = (account: Account) => {
    const text = `${account.email}:${account.password}`;
    navigator.clipboard.writeText(text);
    setCopiedId(account.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Copied!",
      description: "Credentials copied to clipboard",
    });
  };

  const exportAccounts = (format: 'csv' | 'txt') => {
    const accountsToExport = selectedIds.length > 0 
      ? accounts.filter(a => selectedIds.includes(a.id))
      : filteredAccounts;

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      content = 'Email,Password,Recovery Email,Created At,Status\n' + 
        accountsToExport.map(a => 
          `${a.email},${a.password},${a.recoveryEmail},${a.createdAt},${a.status}`
        ).join('\n');
      filename = 'accounts.csv';
      mimeType = 'text/csv';
    } else {
      content = accountsToExport.map(a => `${a.email}:${a.password}`).join('\n');
      filename = 'accounts.txt';
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: `${accountsToExport.length} accounts exported as ${format.toUpperCase()}`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Account Viewer</h1>
            <p className="text-muted-foreground">
              {filteredAccounts.length} accounts found
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => exportAccounts('txt')}
              className="border-border"
            >
              <Download className="w-4 h-4 mr-2" />
              Export TXT
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportAccounts('csv')}
              className="border-border"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-secondary border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === paginatedAccounts.length && paginatedAccounts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Recovery</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAccounts.map((account) => (
                    <TableRow key={account.id} className="border-border">
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(account.id)}
                          onCheckedChange={() => handleSelect(account.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{account.email}</TableCell>
                      <TableCell className="font-mono text-sm">{account.password}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{account.recoveryEmail}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(account.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={account.status === 'success' ? 'default' : 'destructive'}
                          className={account.status === 'success' ? 'bg-green-500/20 text-green-500' : ''}
                        >
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyCredentials(account)}
                          className="h-8 w-8"
                        >
                          {copiedId === account.id ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-border"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-border"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
