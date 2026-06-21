import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  const user = verifyToken(token);
  if (!user || user.role !== "admin") return null;

  return user;
}
