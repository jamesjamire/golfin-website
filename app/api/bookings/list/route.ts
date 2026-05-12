import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      const { getAdminDb } = await import("@/lib/firebaseAdmin");
      const db = getAdminDb();
      const snap = await db
        .collection("bookings")
        .orderBy("bookedAt", "desc")
        .get();
      return NextResponse.json(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    }
    return NextResponse.json([]);
  } catch {
    return NextResponse.json([]);
  }
}
