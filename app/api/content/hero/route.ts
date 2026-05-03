import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_HERO } from "@/lib/types";

let heroData = { ...DEFAULT_HERO };

export async function GET() {
  try {
    // Try to get from Firestore if configured
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const db = getAdminDb();
        const doc = await db.collection("content").doc("hero").get();
        if (doc.exists) {
          return NextResponse.json(doc.data());
        }
      } catch (dbErr) {
        console.warn("Firestore unavailable, using in-memory data:", dbErr);
      }
    }
    return NextResponse.json(heroData);
  } catch (error) {
    console.error("Hero GET error:", error);
    return NextResponse.json(DEFAULT_HERO);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    heroData = { ...heroData, ...body };

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      try {
        const { getAdminDb } = await import("@/lib/firebaseAdmin");
        const db = getAdminDb();
        await db.collection("content").doc("hero").set(heroData, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore save failed:", dbErr);
      }
    }

    return NextResponse.json({ success: true, data: heroData });
  } catch (error) {
    console.error("Hero POST error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
