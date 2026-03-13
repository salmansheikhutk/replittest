import { useQuery } from "@tanstack/react-query";
import { FlaskConical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { TestingRecord } from "@shared/schema";

export function Testing() {
  const { data: records, isLoading, error } = useQuery<TestingRecord[]>({
    queryKey: ["/api/testing"],
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-primary/10 border-b border-primary/20 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FlaskConical className="w-6 h-6 text-primary" />
            <h1 className="font-display text-4xl font-extrabold text-foreground">Testing</h1>
          </div>
          <p className="text-muted-foreground">Records from the testing table.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-12">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-destructive text-sm">Failed to load testing records.</p>
        )}

        {records && records.length === 0 && (
          <p className="text-muted-foreground text-sm">No records found in the testing table.</p>
        )}

        {records && records.length > 0 && (
          <div className="space-y-4">
            {records.map(record => (
              <div
                key={record.id}
                className="border border-border rounded-xl p-5 bg-card flex items-start justify-between gap-4"
              >
                <div>
                  <h2 className="font-semibold text-foreground">{record.name}</h2>
                  {record.description && (
                    <p className="text-muted-foreground text-sm mt-1">{record.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="shrink-0 bg-primary/10 text-primary font-bold text-lg rounded-lg px-4 py-2">
                  {record.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
