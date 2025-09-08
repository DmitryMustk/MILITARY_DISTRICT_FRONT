"use client";

import { cn } from "@/lib/utils";
import { Key } from "react";

type Column = {
  header: string;
  accessor: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column[];
  className?: string;
};

export default function DataTable<T>({
  data,
  columns,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto border border-border", className)}>
      <table className="min-w-full bg-card">
        <thead className="bg-muted text-muted-foreground uppercase text-sm tracking-wider select-none">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="py-4 px-8 text-left font-semibold border-b border-border"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item: T, index: Key | null | undefined) => (
            <tr
              key={index}
              className={cn(
                "transition-colors",
                Number(index) % 2 === 0 ? "bg-secondary/80" : "bg-card",
                "hover:bg-accent/60 cursor-default",
              )}
            >
              {columns.map((column) => (
                <td
                  key={`${index}-${column.accessor}`}
                  className="py-4 px-8 border-b border-border text-foreground"
                >
                  {column.accessor.includes(".")
                    ? String(
                        column.accessor
                          .split(".")
                          .reduce(
                            (acc: unknown, part) =>
                              acc && typeof acc === "object" && acc !== null
                                ? (acc as Record<string, unknown>)[part]
                                : undefined,
                            item as unknown,
                          ),
                      )
                    : String(
                        (item as Record<string, unknown>)[column.accessor],
                      )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
