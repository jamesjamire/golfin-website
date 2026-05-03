export interface HeroContent {
  backgroundImage: string;
  locationBadge: {
    city: string;
    address: string;
    postalCode: string;
    country: string;
  };
  schedule: {
    day: string;
    level: string;
    time: string;
    participants: number;
  };
  headline: string;
  subtext: string;
  membershipCount: string;
}

export interface StoryContent {
  heading: string;
  card1Image: string;
  card1Title: string;
  card2Image: string;
  card2Tags: string[];
  connectHeading: string;
  connectSubtext: string;
}

export interface Event {
  id: string;
  title: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  location: string;
  teamMatch: string;
  startTime: string;
  endTime: string;
  description: string;
  image: string;
  joinLink: string;
  createdAt?: string;
}

export interface StatsContent {
  hashtags: string[];
  statsText: string;
  priceNumber: string;
  easyReachTag: string;
  userGrowthPercent: string;
  userGrowthLabel: string;
  userGrowthSubtext: string;
  userGrowthCta: string;
}

export interface SiteSettings {
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string;
    linkedin: string;
    youtube: string;
  };
  shopLinks: {
    priceList: string;
    accessories: string;
    brochure: string;
    promo: string;
  };
  contactLinks: {
    community: string;
    knowledgeBase: string;
    support: string;
    howToBuy: string;
  };
  learnLinks: {
    about: string;
    pricing: string;
  };
  copyright: string;
}

export const DEFAULT_HERO: HeroContent = {
  backgroundImage:
    "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1920&q=80",
  locationBadge: {
    city: "Jakarta",
    address: "Green Valley, DC 96765",
    postalCode: "",
    country: "Indonesia",
  },
  schedule: {
    day: "Saturday",
    level: "Beginners",
    time: "10:00 AM",
    participants: 4,
  },
  headline: "Take Your Golf Game To The Next Level.",
  subtext:
    "Experience the ultimate golfing journey with expert tips, pro strategies, and professional insights",
  membershipCount: "12k +",
};

export const DEFAULT_STORY: StoryContent = {
  heading: "Experience Golf's True Spirit",
  card1Image:
    "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
  card1Title: "Golf For Everyone",
  card2Image:
    "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800&q=80",
  card2Tags: [
    "Feel The Course Within",
    "Golf Spirit",
    "Pure Golf Spirit",
    "Beyond The Game",
    "Passion, Precision, Play.",
  ],
  connectHeading: "Where Golfers Connect.",
  connectSubtext:
    "We Are Here To Support Your Golfing Journey, From Beginner To Pro. Explore Trusted Resources, A Vibrant Community, And Expert Guidance All In One Place.",
};

export const DEFAULT_EVENTS: Event[] = [
  {
    id: "ryder-cup-2025",
    title: "Ryder Cup 2025",
    dateRange: "Sep 20 - 28 2025",
    startDate: "2025-09-20",
    endDate: "2025-09-28",
    location: "Bethpage Black New York",
    teamMatch: "Team USA vs Europe",
    startTime: "08:00 AM",
    endTime: "12:00 AM",
    description:
      "The Ryder Cup is one of golf's most prestigious team events, pitting the best players from the United States against Europe. This biennial competition showcases elite talent and passionate competition.",
    image:
      "https://images.unsplash.com/photo-1622279457486-62dbd5734f51?w=600&q=80",
    joinLink: "#",
  },
  {
    id: "walker-cup-2025",
    title: "Walker Cup 2025",
    dateRange: "Sep 6 - 7 2025",
    startDate: "2025-09-06",
    endDate: "2025-09-07",
    location: "Cypress Point Club Pebble Beach CA",
    teamMatch: "Team USA vs Great Britain & Ireland",
    startTime: "08:00 AM",
    endTime: "12:00 AM",
    description:
      "The Walker Cup is an amateur golf competition between teams representing the United States and Great Britain & Ireland, held biennially.",
    image:
      "https://images.unsplash.com/photo-1591491634026-6ca0f2d48e33?w=600&q=80",
    joinLink: "#",
  },
];

export const DEFAULT_STATS: StatsContent = {
  hashtags: [
    "#GolfLovers",
    "#GolfVibes",
    "#GolfLife",
    "#GolfCommunity",
    "#GolfChampionship",
  ],
  statsText:
    "Experience Golf At Its Best With The Right Companion Always With You.",
  priceNumber: "199.00+",
  easyReachTag: "Easy To Reach",
  userGrowthPercent: "80.99%",
  userGrowthLabel: "User Growth",
  userGrowthSubtext: "Relative To The Previous Year",
  userGrowthCta: "Improve Your Game Today",
};

export const DEFAULT_SETTINGS: SiteSettings = {
  socialLinks: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    twitter: "https://x.com",
    tiktok: "https://tiktok.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
  shopLinks: {
    priceList: "#",
    accessories: "#",
    brochure: "#",
    promo: "#",
  },
  contactLinks: {
    community: "#",
    knowledgeBase: "#",
    support: "#",
    howToBuy: "#",
  },
  learnLinks: {
    about: "#",
    pricing: "#",
  },
  copyright: "© Copyright 2025, All Rights Reserved",
};
