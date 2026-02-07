import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/api/auth/login");
  }

  const user = await getUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to QueryLens</h1>
          <p className="text-muted-foreground">
            You are successfully authenticated!
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 text-left">
          <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">
                {user?.given_name} {user?.family_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-mono text-xs">{user?.id}</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to Query Interface
          </a>
        </div>
      </div>
    </div>
  );
}
