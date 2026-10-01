import * as React from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBox({
  placeholder = "Search…", className, value, onValueChange, ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
  value?: string;
  onValueChange?: (v: string) => void;
}) {
  const [internal, setInternal] = React.useState("");
  const current = value ?? internal;

  const set = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={current}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
        {...props}
      />
      {current && (
        <button
          type="button"
          onClick={() => set("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
