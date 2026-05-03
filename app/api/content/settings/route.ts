import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_SETTINGS } from "@/lib/types";

let settingsData = { ...DEFAULT_SETTINGS };

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const db = getAdminDb();
        const doc = await db.collection("content").doc("settings").get();
        if (doc.exists) {
          return NextResponse.json(doc.data());
        }
      } catch (dbErr) {
        console.warn("Firestore unavailable:", dbErr);
      }
    }
    return NextResponse.json(settingsData);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    settingsData = { ...settingsData, ...body };

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const db = getAdminDb();
        await db.collection("content").doc("settings").set(settingsData, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore save failed:", dbErr);
      }
    }

    return NextResponse.json({ success: true, data: settingsData });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
