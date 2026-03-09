"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Building2, 
  Clock, 
  Cpu, 
  Mail, 
  User, 
  AlertCircle, 
  Terminal, 
  Link2,
  CheckCircle2,
  Calendar,
  Zap,
  Tag
} from "lucide-react";
import { EmailLog, getStatusConfig } from "./log-columns";
import { cn } from "@/lib/utils";

interface EmailLogDrawerProps {
  log: EmailLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmailLogDrawer({ log, isOpen, onClose }: EmailLogDrawerProps) {
  if (!log) return null;
  const config = getStatusConfig(log.status);
  const StatusIcon = config.icon;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto bg-slate-50 border-l border-slate-200 p-0">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 px-6 py-8">
          <SheetHeader className="text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-center p-2 shadow-sm">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Email Audit</span>
                  </div>
                  <SheetTitle className="text-2xl font-bold tracking-tight text-slate-900 font-display mt-0.5">
                    {log.subject || "No Subject"}
                  </SheetTitle>
                </div>
              </div>
              <Badge className={cn("px-2.5 py-1 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5", config.color)}>
                <StatusIcon className="w-3.5 h-3.5" />
                {log.status}
              </Badge>
            </div>
            <SheetDescription className="flex items-center gap-3 text-xs font-semibold text-slate-500 italic">
               <span className="flex items-center gap-1.5 px-2 py-0.5 border border-slate-100 rounded-lg bg-slate-50 shadow-sm not-italic uppercase tracking-widest text-[9px]">
                <Tag className="w-3 h-3 text-slate-400" />
                {log.type.replace('_', ' ')}
               </span>
               <span className="h-1 w-1 rounded-full bg-slate-300" />
               <span className="flex items-center gap-1.5 px-2 py-0.5 border border-slate-100 rounded-lg bg-slate-50 shadow-sm not-italic uppercase tracking-widest text-[9px]">
                <Cpu className="w-3 h-3 text-slate-400" />
                {log.provider}
               </span>
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Info Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center p-1 group-hover:bg-blue-50 transition-colors">
                  <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recipient</span>
              </div>
              <p className="text-sm font-bold text-slate-900 break-all">{log.recipient}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center p-1 group-hover:bg-blue-50 transition-colors">
                  <Link2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal ID</span>
              </div>
              <p className="text-[11px] font-mono font-bold text-slate-600 tracking-tight break-all">
                {log.emailId}
              </p>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <Clock className="w-3.5 h-3.5" /> Delivery Timeline
            </h3>
            <div className="space-y-3 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-100">
              <div className="flex items-start gap-4 relative pl-4">
                <div className="h-6 w-6 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center z-10 shadow-sm shrink-0">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 tracking-tight">Email Created / Queued</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{format(new Date(log.createdAt), "PPP p")}</p>
                </div>
              </div>

              {log.sentAt && (
                <div className="flex items-start gap-4 relative pl-4">
                  <div className="h-6 w-6 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center z-10 shadow-sm shrink-0">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 tracking-tight">Provider Processed (Sent)</p>
                    <p className="text-[10px] font-medium text-blue-500 mt-1 uppercase tracking-wider">{format(new Date(log.sentAt), "PPP p")}</p>
                  </div>
                </div>
              )}

              {log.deliveredAt && (
                <div className="flex items-start gap-4 relative pl-4">
                  <div className="h-6 w-6 rounded-full bg-white border-2 border-green-100 flex items-center justify-center z-10 shadow-sm shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 tracking-tight">Confirmed Delivered</p>
                    <p className="text-[10px] font-medium text-green-500 mt-1 uppercase tracking-wider">{format(new Date(log.deliveredAt), "PPP p")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Failure Feedback */}
          {(log.status === 'failed' || log.status === 'bounced') && (
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 space-y-2.5 relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-16 w-16 -mr-4 -mt-4 bg-red-100/30 rounded-full blur-2xl group-hover:bg-red-200/50 transition-colors" />
              <div className="flex items-center gap-2 relative">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <h3 className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest">Provider Error Message</h3>
              </div>
              <p className="text-[13px] font-bold text-red-900 leading-snug font-mono italic relative z-10 bg-white/40 p-3 rounded-xl border border-red-100/50">
                {log.errorMessage || "Unknown downstream provider failure"}
              </p>
            </div>
          )}

          {/* Raw Data Module */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" /> Payload Intelligence
                </h3>
             </div>
             <div className="rounded-2xl border border-slate-200 bg-[#0f1117] overflow-hidden shadow-2xl transition-all duration-300 ring-4 ring-slate-100">
               <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 ml-2 font-mono">provider_response.json</span>
               </div>
               <div className="p-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                 <pre className="text-[11px] font-mono text-blue-400/90 leading-relaxed selection:bg-blue-500/30">
                   {JSON.stringify(log.metadata || {}, null, 2)}
                 </pre>
               </div>
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
