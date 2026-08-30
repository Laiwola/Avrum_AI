import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/avrum/loading";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
};

export function DataTable<T>({
  columns, data, loading, emptyTitle = "No records yet", emptyDescription,
  toolbar, footer, className, getRowKey,
}: {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbar?: ReactNode;
  footer?: ReactNode;
  className?: string;
  getRowKey?: (row: T, index: number) => string;
}) {
  if (loading) return <TableSkeleton />;

  return (
    <div className={cn("surface-panel overflow-hidden", className)}>
      {toolbar && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">{toolbar}</div>
      )}

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <Inbox className="size-6" />
          </span>
          <p className="mt-4 text-sm font-bold">{emptyTitle}</p>
          {emptyDescription && (
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">{emptyDescription}</p>
          )}
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {columns.map((c) => (
                  <TableHead
                    key={c.key}
                    className={cn(
                      "whitespace-nowrap text-2xs font-bold uppercase tracking-wider text-muted-foreground",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.className,
                    )}
                  >
                    {c.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={getRowKey?.(row, i) ?? i}>
                  {columns.map((c) => (
                    <TableCell
                      key={c.key}
                      className={cn(
                        "text-sm",
                        c.align === "right" && "text-right",
                        c.align === "center" && "text-center",
                        c.className,
                      )}
                    >
                      {c.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {footer && <div className="border-t border-border p-3">{footer}</div>}
    </div>
  );
}
