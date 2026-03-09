"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  Send, 
  Clock, 
  AlertCircle, 
  RotateCcw,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmailLog {
  _id: string;
  emailId: string;
  recipient: string;
  subject: string;
  type: string;
  provider: string;
  status: string;
  errorMessage?: string;
  metadata?: any;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

interface ColumnProps {
  onView: (log: EmailLog) => void;
}

export const getStatusConfig = (status: string) => {
  switch ((status ?? '').toLowerCase()) {
    case 'delivered':
      return { color: 'text-green-600 bg-green-50 border-green-100', icon: CheckCircle2 };
    case 'sent':
      return { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Send };
    case 'failed':
      return { color: 'text-red-600 bg-red-50 border-red-100', icon: AlertCircle };
    case 'bounced':
      return { color: 'text-orange-600 bg-orange-50 border-orange-100', icon: RotateCcw };
    case 'queued':
      return { color: 'text-slate-500 bg-slate-50 border-slate-100', icon: Clock };
    default:
      return { color: 'text-slate-400 bg-slate-50 border-slate-100', icon: Clock };
  }
};

// Uses DataTable's Column interface: cell receives the item directly (not { row })
export const getEmailLogColumns = ({ onView }: ColumnProps) => [
  {
    header: "Recipient",
    accessorKey: "recipient",
    cell: (log: EmailLog) => (
      <div className="flex flex-col min-w-50">
        <span className="font-bold text-slate-900 tracking-tight text-[13px]">{log?.recipient ?? '—'}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
          {log?.type?.replace(/_/g, ' ') ?? '—'}
        </span>
      </div>
    ),
  },
  {
    header: "Subject",
    accessorKey: "subject",
    cell: (log: EmailLog) => (
      <div className="max-w-62.5 truncate text-[12px] font-medium text-slate-600">
        {log?.subject ?? '—'}
      </div>
    ),
  },
  {
    header: "Provider",
    accessorKey: "provider",
    cell: (log: EmailLog) => (
      <Badge variant="outline" className="capitalize text-[10px] font-bold px-1.5 py-0 border-slate-200 text-slate-500 rounded-lg">
        {log?.provider ?? '—'}
      </Badge>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (log: EmailLog) => {
      const status = log?.status ?? '';
      const config = getStatusConfig(status);
      const Icon = config.icon;
      return (
        <Badge
          variant="outline"
          className={cn("flex items-center gap-1.5 w-fit px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider rounded-xl", config.color)}
        >
          <Icon className="w-3 h-3" />
          {status || '—'}
        </Badge>
      );
    },
  },
  {
    header: "Sent At",
    accessorKey: "sentAt",
    cell: (log: EmailLog) => log?.sentAt ? (
      <div className="text-[11px] font-medium text-slate-500">
        {format(new Date(log.sentAt), "MMM d, HH:mm")}
      </div>
    ) : (
      <span className="text-slate-300">—</span>
    ),
  },
  {
    header: "Delivered At",
    accessorKey: "deliveredAt",
    cell: (log: EmailLog) => log?.deliveredAt ? (
      <div className="text-[11px] font-medium text-slate-500">
        {format(new Date(log.deliveredAt), "MMM d, HH:mm")}
      </div>
    ) : (
      <span className="text-slate-300">—</span>
    ),
  },
  {
    header: "",
    accessorKey: "actions",
    isAction: true,
    cell: (log: EmailLog) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => log && onView(log)}
        className="h-8 w-8 p-0 hover:bg-slate-100 rounded-xl transition-colors group"
      >
        <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
      </Button>
    ),
  },
];

