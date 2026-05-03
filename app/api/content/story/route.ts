import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_STORY } from "@/lib/types";

let storyData = { ...DEFAULT_STORY };

export async function GET() {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const db = getAdminDb();
        const doc = await db.collection("content").doc("story").get();
        if (doc.exists) {
          return NextResponse.json(doc.data());
        }
      } catch (dbErr) {
        console.warn("Firestore unavailable:", dbErr);
      }
    }
    return NextResponse.json(storyData);
  } catch (error) {
    console.error("Story GET error:", error);
    return NextResponse.json(DEFAULT_STORY);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    storyData = { ...storyData, ...body };

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const db = getAdminDb();
        await db.collection("content").doc("story").set(storyData, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore save failed:", dbErr);
      }
    }

    return NextResponse.json({ success: true, data: storyData });
  } catch (error) {
    console.error("Story POST error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
