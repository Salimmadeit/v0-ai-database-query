import { QueryPageClient } from "@/components/query-page-client";
import { AuthHeader } from "@/components/auth/auth-header";

export default async function QueryPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">
              QueryLens
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-Powered Database Explorer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AuthHeader />
        </div>
      </header>

      <QueryPageClient />
    </div>
  );
}


