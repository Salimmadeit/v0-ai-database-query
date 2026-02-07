import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginButton } from "./login-button";
import { RegisterButton } from "./register-button";
import { UserProfile } from "./user-profile";

export async function AuthHeader() {
  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (authenticated) {
    return <UserProfile />;
  }

  return (
    <div className="flex items-center gap-2">
      <LoginButton />
      <RegisterButton />
    </div>
  );
}
