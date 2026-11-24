import Link from "next/link";
import { ClipboardList, ChevronRight } from "lucide-react";
import { formatAdminMoney } from "@/lib/admin";

import type { CustomerOrder } from "@/types/customer.type";
import { customerStatusLabels, formatCustomerDate } from "@/lib/customer";

export default function CustomerOrderCard({ order }: { order: CustomerOrder }) {
  return (
    <Link
      href={`/customer/orders?order=${encodeURIComponent(order.id)}`}
      className="flex min-h-20 items-center gap-4 rounded-[17px] border border-[#edf0ec] bg-white p-4 shadow-[0_1px_2px_rgba(15,45,30,0.10)] hover:border-[#b5d3c1]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#eaf5ee] text-[#075638]">
        <ClipboardList size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold">{order.orderNumber}</p>
          <span className="rounded-full bg-[#e1f1fa] px-2 py-0.5 text-[11px] font-semibold text-[#075d83]">
            {customerStatusLabels[order.orderStatus]}
          </span>
        </div>
        <p className="mt-1 truncate text-[14px] text-[#66716d]">
          {order.orderItems
            .map((item) => `${item.quantity} × ${item.productName}`)
            .join(", ")}{" "}
          · {formatCustomerDate(order.createdAt)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-bold">{formatAdminMoney(order.totalAmount)}</p>
        <ChevronRight size={17} className="ml-auto mt-1 text-[#a8b4ad]" />
      </div>
    </Link>
  );
}
