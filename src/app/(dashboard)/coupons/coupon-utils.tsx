import { Tag, MoreHorizontal, Edit, Trash2, Power, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ICoupon } from "@/types/subscription"; // Assuming ICoupon is defined in types

export type Coupon = ICoupon;

export const getCouponColumns = ({
  onView,
  onEdit,
  onDelete,
  onToggle,
}: {
  onView: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
  onToggle: (coupon: Coupon) => void;
}) => [
  {
    header: "Coupon Code",
    accessorKey: "code",
    cell: (row: Coupon) => (
      <div className="flex flex-col">
        <span className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <Tag className="h-3.5 w-3.5 text-emerald-500" />
          {row.code}
        </span>
        <span className="text-xs text-slate-500 font-medium">{row.name}</span>
      </div>
    ),
  },
  {
    header: "Type",
    accessorKey: "discountType",
    cell: (row: Coupon) => (
      <Badge variant="outline" className="capitalize bg-slate-50 border-slate-200 text-slate-600 font-semibold px-2.5 py-0.5 whitespace-nowrap">
        {row.discountType.replace('_', ' ')}
      </Badge>
    ),
  },
  {
    header: "Discount",
    accessorKey: "discountAmount",
    cell: (row: Coupon) => (
      <span className="font-bold text-emerald-600 tabular-nums">
        {row.discountType === 'percentage' ? `${row.discountAmount}%` : `$${row.discountAmount}`}
      </span>
    ),
  },
  {
    header: "Usage",
    accessorKey: "usageCount",
    cell: (row: Coupon) => (
      <div className="flex flex-col gap-1.5 w-full max-w-30">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <span>{row.usageCount} used</span>
          <span>{row.usageLimit ? `${row.usageLimit} max` : "∞"}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
            style={{ width: `${row.usageLimit ? Math.min((row.usageCount / row.usageLimit) * 100, 100) : 5}%` }}
          />
        </div>
      </div>
    ),
  },
  {
    header: "Expiry",
    accessorKey: "expiryDate",
    cell: (row: Coupon) => (
      <div className="flex items-center gap-2 whitespace-nowrap">
        {row.expiryDate ? (
          <>
            <div className={`h-1.5 w-1.5 rounded-full ${new Date(row.expiryDate) < new Date() ? "bg-rose-400" : "bg-emerald-400"}`} />
            <span className={`text-xs font-semibold ${new Date(row.expiryDate) < new Date() ? "text-rose-600" : "text-slate-600"}`}>
              {format(new Date(row.expiryDate), "MMM dd, yyyy")}
            </span>
          </>
        ) : (
          <span className="text-xs font-semibold text-slate-400">Never</span>
        )}
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: (row: Coupon) => (
      <Badge 
        className={row.isActive 
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold px-2.5 shadow-none uppercase text-[10px] tracking-widest" 
          : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 font-bold px-2.5 shadow-none uppercase text-[10px] tracking-widest"
        }
      >
        {row.isActive ? "Active" : "Paused"}
      </Badge>
    ),
  },
  {
    header: "Actions",
    id: "actions",
    cell: (row: Coupon) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 text-slate-500">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 shadow-lg border-slate-200/60 p-1.5">
          <DropdownMenuItem onClick={() => onView(row)} className="gap-2.5 py-2 cursor-pointer font-medium text-slate-600 focus:bg-slate-50 focus:text-emerald-600">
            <Eye className="h-4 w-4 opacity-70" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(row)} className="gap-2.5 py-2 cursor-pointer font-medium text-slate-600 focus:bg-slate-50 focus:text-emerald-600">
            <Edit className="h-4 w-4 opacity-70" /> Edit Coupon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggle(row)} className="gap-2.5 py-2 cursor-pointer font-medium text-slate-600 focus:bg-slate-50 focus:text-emerald-600">
            <Power className="h-4 w-4 opacity-70" /> {row.isActive ? "Pause Coupon" : "Activate Coupon"}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-100 my-1" />
          <DropdownMenuItem onClick={() => onDelete(row)} className="gap-2.5 py-2 cursor-pointer font-semibold text-rose-500 focus:bg-rose-50 focus:text-rose-600">
            <Trash2 className="h-4 w-4 opacity-70" /> Delete Forever
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
