import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, name, email, phone } = await request.json();

    if (!sessionId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = {
      sessionId,
      name,
      email,
      phone: phone || "",
      bookedAt: new Date().toISOString(),
    };

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      const { getAdminDb } = await import("@/lib/firebaseAdmin");
      const db = getAdminDb();

      // Save booking
      await db.collection("bookings").add(booking);

      // Increment bookedSpots on the session
      const sessionRef = db.collection("bookingSessions").doc(sessionId);
      const sessionDoc = await sessionRef.get();
      if (sessionDoc.exists) {
        const data = sessionDoc.data()!;
        const newSpots = Math.min(
          (data.bookedSpots || 0) + 1,
          data.maxSpots || 8
        );
        await sessionRef.update({ bookedSpots: newSpots });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
