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
  HeroContent,
  StoryContent,
  Event,
  StatsContent,
  SiteSettings,
} from "@/lib/types";

async function fetchContent<T>(url: string, fallback: T): Promise<T> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}${url}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export default async function Home() {
  const [hero, story, events, stats, settings] = await Promise.all([
    fetchContent<HeroContent>("/api/content/hero", DEFAULT_HERO),
    fetchContent<StoryContent>("/api/content/story", DEFAULT_STORY),
    fetchContent<Event[]>("/api/content/events", DEFAULT_EVENTS),
    fetchContent<StatsContent>("/api/content/stats", DEFAULT_STATS),
    fetchContent<SiteSettings>("/api/content/settings", DEFAULT_SETTINGS),
  ]);

  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero content={hero} />
      <Story content={story} />
      <Events events={events} />
      <Stats content={stats} />
      <Footer settings={settings} />
    </main>
  );
}
