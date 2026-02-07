import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function RegisterButton() {
  return (
    <RegisterLink>
      <Button variant="outline" size="sm" className="gap-2">
        <UserPlus className="h-4 w-4" />
        Sign Up
      </Button>
    </RegisterLink>
  );
}
