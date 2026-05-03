import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "golfin_admin_session";
const SESSION_VALUE = "authenticated";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const adminPassword =
    process.env.ADMIN_PASSWORD || "golf2025admin";
  return password === adminPassword;
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === SESSION_VALUE;
}
