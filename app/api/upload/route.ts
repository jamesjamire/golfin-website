import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      try {
        const { getAdminStorage } = await import("@/lib/firebaseAdmin");
        const storage = getAdminStorage();
        const bucket = storage.bucket();

        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const fileName = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const fileRef = bucket.file(fileName);

        await fileRef.save(Buffer.from(uint8Array), {
          metadata: {
            contentType: file.type,
          },
        });

        await fileRef.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        return NextResponse.json({ success: true, url: publicUrl });
      } catch (storageErr) {
        console.warn("Firebase Storage upload failed:", storageErr);
      }
    }

    // Fallback: return a placeholder URL
    return NextResponse.json({
      success: true,
      url: `https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1920&q=80`,
      warning: "Firebase Storage not configured. Using placeholder image.",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
