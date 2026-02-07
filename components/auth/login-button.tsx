import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function LoginButton() {
  return (
    <LoginLink>
      <Button variant="default" size="sm" className="gap-2">
        <LogIn className="h-4 w-4" />
        Sign In
      </Button>
    </LoginLink>
  );
}
