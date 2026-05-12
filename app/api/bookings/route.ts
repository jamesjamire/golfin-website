import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_BOOKING_SESSIONS, BookingSession } from "@/lib/types";
import { isAdminAuthenticated } from "@/lib/auth";

let sessionsData: BookingSession[] = [...DEFAULT_BOOKING_SESSIONS];

async function getDb() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (projectId && projectId !== "your_project_id") {
    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    return getAdminDb();
  }
  return null;
}

export async function GET() {
  try {
    const db = await getDb();
    if (db) {
      const snap = await db
        .collection("bookingSessions")
        .orderBy("createdAt", "desc")
        .get();
      if (!snap.empty) {
        return NextResponse.json(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      }
    }
    return NextResponse.json(sessionsData);
  } catch {
    return NextResponse.json(sessionsData);
  }
}

export async function POST(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: BookingSession = await request.json();
    const session: BookingSession = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    const db = await getDb();
    if (db) {
      const ref = body.id
        ? db.collection("bookingSessions").doc(body.id)
        : db.collection("bookingSessions").doc();
      session.id = ref.id;
      await ref.set(session);
    } else {
      const idx = sessionsData.findIndex((s) => s.id === body.id);
      if (idx >= 0) sessionsData[idx] = session;
      else sessionsData.unshift(session);
    }

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  try {
    const db = await getDb();
    if (db) {
      await db.collection("bookingSessions").doc(id).delete();
    } else {
      sessionsData = sessionsData.filter((s) => s.id !== id);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
