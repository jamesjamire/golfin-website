import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_EVENTS, Event } from "@/lib/types";

let eventsData: Event[] = [...DEFAULT_EVENTS];

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const db = getAdminDb();
        let snapshot;
        try {
          snapshot = await db.collection("events").orderBy("createdAt", "desc").get();
        } catch {
          snapshot = await db.collection("events").get();
        }
        const events = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        return NextResponse.json(events);
      } catch (dbErr) {
        console.warn("Firestore unavailable:", dbErr);
      }
    }
    return NextResponse.json(eventsData);
  } catch (error) {
    console.error("Events GET error:", error);
    return NextResponse.json(DEFAULT_EVENTS);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, event } = body;

    if (action === "create") {
      const newEvent: Event = {
        ...event,
        id: event.id || `event-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId && projectId !== "your_project_id") {
        try {
          const { getAdminDb } = await import("@/lib/firebaseAdmin");
          const db = getAdminDb();
          await db.collection("events").doc(newEvent.id).set(newEvent);
        } catch (dbErr) {
          console.warn("Firestore save failed:", dbErr);
        }
      }

      eventsData = [newEvent, ...eventsData];
      return NextResponse.json({ success: true, event: newEvent });
    }

    if (action === "update") {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId && projectId !== "your_project_id") {
        try {
          const { getAdminDb } = await import("@/lib/firebaseAdmin");
          const db = getAdminDb();
          await db.collection("events").doc(event.id).set(event, { merge: true });
        } catch (dbErr) {
          console.warn("Firestore update failed:", dbErr);
        }
      }

      eventsData = eventsData.map((e) => (e.id === event.id ? { ...e, ...event } : e));
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      const { id } = body;
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId && projectId !== "your_project_id") {
        try {
          const { getAdminDb } = await import("@/lib/firebaseAdmin");
          const db = getAdminDb();
          await db.collection("events").doc(id).delete();
        } catch (dbErr) {
          console.warn("Firestore delete failed:", dbErr);
        }
      }

      eventsData = eventsData.filter((e) => e.id !== id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Events POST error:", error);
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
