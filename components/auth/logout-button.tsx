import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <LogoutLink>
      <Button variant="ghost" size="sm" className="gap-2">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </LogoutLink>
  );
}
