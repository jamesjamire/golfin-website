import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Events from "@/components/Events";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import {
  DEFAULT_HERO,
  DEFAULT_STORY,
  DEFAULT_EVENTS,
  DEFAULT_STATS,
  DEFAULT_SETTINGS,
  DEFAULT_BOOKING_SESSIONS,
  HeroContent,
  StoryContent,
  Event,
  StatsContent,
  SiteSettings,
  BookingSession,
} from "@/lib/types";

async function fetchFromFirestore<T>(collection: string, doc: string | null, fallback: T): Promise<T> {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_project_id") {
      const { getAdminDb } = await import("@/lib/firebaseAdmin");
      const db = getAdminDb();
      if (doc) {
        const snap = await db.collection(collection).doc(doc).get();
        if (snap.exists) return snap.data() as T;
      } else {
        let snap;
        try {
          snap = await db.collection(collection).orderBy("createdAt", "desc").get();
        } catch {
          snap = await db.collection(collection).get();
        }
        if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() })) as T;
      }
    }
  } catch {}
  return fallback;
}

export default async function Home() {
  const [hero, story, events, stats, settings, bookingSessions] = await Promise.all([
    fetchFromFirestore<HeroContent>("content", "hero", DEFAULT_HERO),
    fetchFromFirestore<StoryContent>("content", "story", DEFAULT_STORY),
    fetchFromFirestore<Event[]>("events", null, DEFAULT_EVENTS),
    fetchFromFirestore<StatsContent>("content", "stats", DEFAULT_STATS),
    fetchFromFirestore<SiteSettings>("content", "settings", DEFAULT_SETTINGS),
    fetchFromFirestore<BookingSession[]>("bookingSessions", null, DEFAULT_BOOKING_SESSIONS),
  ]);

  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero content={hero} bookingSessions={bookingSessions} />
      <Story content={story} />
      <Events events={events} />
      <Stats content={stats} />
      <Footer settings={settings} />
    </main>
  );
}
