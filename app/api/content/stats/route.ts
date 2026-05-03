import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_STATS } from "@/lib/types";

let statsData = { ...DEFAULT_STATS };

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const db = getAdminDb();
        const doc = await db.collection("content").doc("stats").get();
        if (doc.exists) {
          return NextResponse.json(doc.data());
        }
      } catch (dbErr) {
        console.warn("Firestore unavailable:", dbErr);
      }
    }
    return NextResponse.json(statsData);
  } catch (error) {
    console.error("Stats GET error:", error);
    return NextResponse.json(DEFAULT_STATS);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    statsData = { ...statsData, ...body };

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const db = getAdminDb();
        await db.collection("content").doc("stats").set(statsData, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore save failed:", dbErr);
      }
    }

    return NextResponse.json({ success: true, data: statsData });
  } catch (error) {
    console.error("Stats POST error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
