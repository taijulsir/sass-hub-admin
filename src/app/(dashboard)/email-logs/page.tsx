"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  Mail, 
  Search, 
  RefreshCw, 
  Activity, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Filter,
  BarChart3,
  Send,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { useFetchData } from "@/hooks/use-fetch-data";
import { AdminService } from "@/services/admin.service";
import { DataTable } from "@/components/ui-system/table/DataTable";
import { Pagination } from "@/components/ui-system/pagination";
import { getEmailLogColumns, EmailLog } from "./components/log-columns";
import { EmailLogDrawer } from "./components/log-drawer";
import { cn } from "@/lib/utils";

export default function EmailLogsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [provider, setProvider] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchParams = useMemo(() => ({
    page,
    limit,
    search,
    status: status === "all" ? undefined : status,
    type: type === "all" ? undefined : type,
    provider: provider === "all" ? undefined : provider,
  }), [page, limit, search, status, type, provider]);

  const {
    data: logs,
    loading,
    totalItems,
    totalPages,
  } = useFetchData<EmailLog>(
    AdminService.getEmailLogs, 
    fetchParams, 
    [refreshKey]
  );

  const handleView = useCallback((log: EmailLog) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  }, []);

  const columns = useMemo(() => getEmailLogColumns({
    onView: handleView,
  }), [handleView]);

  const stats = [
    { label: "Total Emails", value: totalItems, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Failed", value: logs.filter(l => l.status === 'failed' || l.status === 'bounced').length, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Delivered", value: logs.filter(l => l.status === 'delivered').length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Queued", value: logs.filter(l => l.status === 'queued').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white/50">
      {/* Header Section */}
      <div className="px-6 py-4 border-b bg-white shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-center p-2 shadow-sm">
              <Mail className="h-full w-full text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none font-display">
                Email Logs
              </h1>
              <p className="text-[11px] text-slate-500 mt-1 font-medium italic">
                Monitor and audit all outgoing platform communications.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" onClick={() => setRefreshKey(k => k + 1)} disabled={loading} className="h-8 text-xs rounded-xl shadow-sm">
                <RefreshCw className={cn("h-3 w-3 mr-1.5", loading && "animate-spin")} />
                Refresh Logs
             </Button>
             <Button size="sm" className="h-8 text-xs bg-slate-900 border-none hover:bg-slate-800 rounded-xl shadow-md transition-all active:scale-95 group">
                <Send className="h-3.5 w-3.5 mr-1.5 group-hover:rotate-12 transition-transform" />
                Live Tracker
             </Button>
          </div>
        </div>

        {/* Compact Stats Row */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3 px-1 border-r border-slate-100 last:border-none">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate leading-none mb-1">{stat.label}</p>
                    <p className="text-base font-bold text-slate-900 tracking-tight leading-none font-display">{stat.value}</p>
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Filter Toolbar */}
      <div className="px-6 py-3 shrink-0 border-b bg-slate-50/30">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-75 max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
                placeholder="Search recipient or subject..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-[13px] bg-white border-slate-200 focus-visible:ring-blue-600 transition-all shadow-sm rounded-xl"
            />
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
             <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-32 h-8 text-[11px] bg-white border-slate-200 focus:ring-blue-600 rounded-xl shadow-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
              </SelectContent>
            </Select>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-32 h-8 text-[11px] bg-white border-slate-200 focus:ring-blue-600 rounded-xl shadow-sm uppercase">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="invite">Invite</SelectItem>
                <SelectItem value="password_reset">Password Reset</SelectItem>
                <SelectItem value="billing_invoice">Billing Invoice</SelectItem>
                <SelectItem value="verification">Verification</SelectItem>
              </SelectContent>
            </Select>

            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="w-32 h-8 text-[11px] bg-white border-slate-200 focus:ring-blue-600 rounded-xl shadow-sm uppercase">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="resend">Resend</SelectItem>
                <SelectItem value="smtp">SMTP</SelectItem>
                <SelectItem value="sendgrid">SendGrid</SelectItem>
              </SelectContent>
            </Select>

            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setSearch(""); setStatus("all"); setType("all"); setProvider("all"); }}
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 rounded-xl"
            >
                <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full flex flex-col">
            {logs.length === 0 && !loading ? (
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center space-y-4 max-w-sm">
                  <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-sm">
                    <Mail className="h-8 w-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 font-display">No email logs yet</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      All outgoing platform communications will appear here as they are sent.
                    </p>
                  </div>
                  <Button variant="outline" className="h-9 px-6 text-xs font-bold rounded-xl" onClick={() => setRefreshKey(k => k + 1)}>
                    Refresh Tracker
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <DataTable 
                   columns={columns as any}
                   data={logs}
                   loading={loading}
                   onRowClick={handleView}
                />
                
                <div className="px-6 py-3 border-t bg-white shrink-0">
                   <Pagination 
                      currentPage={page}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      limit={limit}
                      onPageChange={setPage}
                      onLimitChange={(newLimit) => {
                         setLimit(newLimit);
                         setPage(1);
                      }}
                   />
                </div>
              </>
            )}
        </div>
      </div>

      {/* Email Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-140 border-l border-slate-100 shadow-2xl">
           <SheetHeader className="sr-only">
              <SheetTitle>Email Details</SheetTitle>
              <SheetDescription>Inspect email delivery status and provider metadata</SheetDescription>
           </SheetHeader>
           {selectedLog && (
              <EmailLogDrawer 
                 log={selectedLog} 
                 isOpen={isDrawerOpen}
                 onClose={() => setIsDrawerOpen(false)}
              />
           )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

