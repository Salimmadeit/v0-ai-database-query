import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getUser() {
  const { getUser } = getKindeServerSession();
  return await getUser();
}

export async function isAuthenticated() {
  const { isAuthenticated } = getKindeServerSession();
  return await isAuthenticated();
}

export async function getUserDetails() {
  const { getUser, getPermissions, getOrganization } = getKindeServerSession();
  
  const user = await getUser();
  const permissions = await getPermissions();
  const organization = await getOrganization();

  return {
    user,
    permissions,
    organization,
  };
}
