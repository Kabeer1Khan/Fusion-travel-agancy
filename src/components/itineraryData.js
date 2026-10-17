const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;
const p = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&h=700&q=80`;

export const ITINERARY_DATA = {
  bali: {
    itinerary: [
      "Arrival in Bali & beach welcome",
      "Surf lesson & beach day",
      "Uluwatu temple & sunset",
      "Island hopping & snorkeling",
      "Free day / local markets",
      "Baturama & yoga session",
      "Departure",
    ],
    guide: {
      name: "Made Suryana",
      role: "Local Guide",
      years: "8+ years",
      quote:
        "Born and raised in Bali — I’ll show you the authentic side of this island, from hidden beaches to local culture.",
      bio: "Made grew up in a village near Ubud and has guided travelers across Bali for over eight years, from sunrise surf breaks to quiet temple ceremonies.",
      languages: ["English", "Bahasa", "Balinese"],
      specialties: ["Surf spots", "Temple culture", "Hidden beaches"],
      img: p("photo-1507003211169-0a1dd7228f2d"),
    },
    gallery: [
      u("photo-1537996194471-e657df975ab4"),
      u("photo-1555400038-63f5ba517a47"),
      u("photo-1518548419970-58e3b4079ab2"),
    ],
  },
  santorini: {
    itinerary: [
      "Arrival in Fira & caldera welcome",
      "Oia village & sunset walk",
      "Sailing & volcanic hot springs",
      "Wine tasting in Pyrgos",
      "Free day / black sand beaches",
      "Departure",
    ],
    guide: {
      name: "Elena Markou",
      role: "Local Guide",
      years: "10+ years",
      quote:
        "I grew up between these cliffs and caldera sunsets — let me show you the Santorini that postcards miss.",
      bio: "Elena is a Santorini native who has spent a decade leading small groups through hidden villages, family wineries and quiet cliff paths.",
      languages: ["English", "Greek", "Italian"],
      specialties: ["Wine tours", "Sunset spots", "Village walks"],
      img: p("photo-1438761681033-6461ffad8d80"),
    },
    gallery: [
      u("photo-1570077188670-e3a8d69ac5ff"),
      u("photo-1613395877344-13d4a8e0d49e"),
      u("photo-1533105079780-92b9be482077"),
    ],
  },
  maldives: {
    itinerary: [
      "Seaplane arrival & lagoon welcome",
      "House reef snorkeling",
      "Sandbank picnic & sunset sail",
      "Island hopping & local village",
      "Free day / spa & sunset",
      "Departure",
    ],
    guide: {
      name: "Ibrahim Naseem",
      role: "Island Guide",
      years: "9+ years",
      quote:
        "The sea taught me everything — I’ll take you to reefs and sandbanks most visitors never find.",
      bio: "Ibrahim grew up on a small atoll and has guided snorkeling and sailing trips across the islands for nine years.",
      languages: ["English", "Dhivehi", "Hindi"],
      specialties: ["Snorkeling", "Reef safety", "Sunset sailing"],
      img: p("photo-1500648767791-00dcc994a43e"),
    },
    gallery: [
      u("photo-1514282401047-d79a71a590e8"),
      u("photo-1573843981267-be1999ff37cd"),
      u("photo-1507525428034-b723cf961d3e"),
    ],
  },
  kyoto: {
    itinerary: [
      "Arrival & Gion evening stroll",
      "Fushimi Inari sunrise hike",
      "Arashiyama bamboo & temples",
      "Tea ceremony & kimono day",
      "Nara day trip",
      "Free day / Nishiki market",
      "Zen meditation & kaiseki dinner",
      "Departure",
    ],
    guide: {
      name: "Haruka Tanaka",
      role: "Cultural Guide",
      years: "12+ years",
      quote:
        "Kyoto reveals itself slowly — I’ll lead you through quiet lanes and hidden temples where tradition still lives.",
      bio: "Haruka was born in Kyoto and has spent twelve years sharing its tea houses, gardens and festivals with curious travelers.",
      languages: ["English", "Japanese", "French"],
      specialties: ["Tea ceremony", "Temples", "Local cuisine"],
      img: p("photo-1494790108377-be9c29b29330"),
    },
    gallery: [
      u("photo-1493976040374-85c6e86f149e"),
      u("photo-1528360983277-13d401cdc186"),
      u("photo-1545569341-9eb8b30979d9"),
    ],
  },
  "swiss-alps": {
    itinerary: [
      "Arrival in Interlaken",
      "Lake Brienz cruise",
      "Grindelwald valley hike",
      "Jungfraujoch by rail",
      "Free day / alpine villages",
      "Lauterbrunnen waterfalls",
      "Zermatt & Matterhorn views",
      "Gornergrat sunrise hike",
      "Departure",
    ],
    guide: {
      name: "Lukas Brunner",
      role: "Alpine Guide",
      years: "11+ years",
      quote:
        "I’ve walked these trails since I was a kid — I’ll show you the viewpoints and huts only locals know.",
      bio: "Lukas is a certified mountain guide from Grindelwald with eleven years of leading hikes from lakeside paths to high alpine ridges.",
      languages: ["English", "German", "French"],
      specialties: ["Alpine hiking", "Mountain huts", "Photography"],
      img: p("photo-1506794778202-cad84cf45f1d"),
    },
    gallery: [
      u("photo-1531366936337-7c912a4589a7"),
      u("photo-1530122037265-a5f1f91d3b99"),
      u("photo-1501785888041-af3ef285b470"),
    ],
  },
  "costa-rica": {
    itinerary: [
      "Arrival in San José",
      "Arenal volcano & hot springs",
      "Rainforest canopy walk",
      "Wildlife river safari",
      "Monteverde cloud forest hike",
      "Pacific beach day",
      "Yoga & sunset surf",
      "Departure",
    ],
    guide: {
      name: "Camila Rojas",
      role: "Nature Guide",
      years: "7+ years",
      quote:
        "Pura vida starts in the forest — I’ll help you spot sloths, toucans and the little wonders in between.",
      bio: "Camila is a biologist-turned-guide who has led wildlife and rainforest trips across Costa Rica for seven years.",
      languages: ["English", "Spanish", "Portuguese"],
      specialties: ["Wildlife spotting", "Rainforest hikes", "Birdwatching"],
      img: p("photo-1534528741775-53994a69daeb"),
    },
    gallery: [
      u("photo-1518259102261-b40117eabbfc"),
      u("photo-1506929562872-bb421503ef21"),
      u("photo-1476514525535-07fb3b4ae5f1"),
    ],
  },
  portugal: {
    itinerary: [
      "Arrival in Lisbon & Alfama stroll",
      "Surf lesson & beach day",
      "Sintra palaces & Cabo da Roca",
      "Coastal towns & seafood lunch",
      "Free day / local markets",
      "Departure",
    ],
    guide: {
      name: "Tiago Almeida",
      role: "Coastal Guide",
      years: "8+ years",
      quote:
        "The Atlantic is in my blood — I’ll take you to the best waves, the quietest coves and the tastiest grilled fish.",
      bio: "Tiago is a surf coach and coastal guide who has spent eight years showing travelers the Portuguese coast beyond the tourist routes.",
      languages: ["English", "Portuguese", "Spanish"],
      specialties: ["Surf coaching", "Coastal towns", "Local food"],
      img: p("photo-1472099645785-5658abf4ff4e"),
    },
    gallery: [
      u("photo-1502680390469-be75c86b636f"),
      u("photo-1555881400-74d7acaacd8b"),
      u("photo-1506929562872-bb421503ef21"),
    ],
  },
  thailand: {
    itinerary: [
      "Arrival in Phuket & beach welcome",
      "Phang Nga Bay by longtail boat",
      "Phi Phi island hopping & snorkeling",
      "Old town temples & street food",
      "Free day / local markets",
      "Cooking class & sunset cruise",
      "Departure",
    ],
    guide: {
      name: "Niran Chaiyasit",
      role: "Local Guide",
      years: "9+ years",
      quote:
        "Thailand is best shared at the table and on the water — I’ll show you my favorite islands and street-food corners.",
      bio: "Niran grew up in southern Thailand and has guided island-hopping and food trips for nine years.",
      languages: ["English", "Thai", "Mandarin"],
      specialties: ["Island hopping", "Street food", "Temples"],
      img: p("photo-1519085360753-af0119f7cbe7"),
    },
    gallery: [
      u("photo-1528181304800-259b08848526"),
      u("photo-1552465011-b4e21bf6e79a"),
      u("photo-1507525428034-b723cf961d3e"),
    ],
  },
  peru: {
    itinerary: [
      "Arrival in Cusco & acclimatization",
      "Sacred Valley & Pisac market",
      "Ollantaytambo ruins",
      "Inca trail trek begins",
      "High pass & alpine camp",
      "Cloud forest descent",
      "Machu Picchu sunrise",
      "Free day / Aguas Calientes",
      "Cusco & farewell dinner",
      "Departure",
    ],
    guide: {
      name: "Mateo Quispe",
      role: "Andean Guide",
      years: "13+ years",
      quote:
        "These mountains are my home — I’ll walk you along ancient paths and introduce you to the communities who keep them alive.",
      bio: "Mateo is a Quechua-speaking guide from the Sacred Valley with thirteen years of leading treks to Machu Picchu and beyond.",
      languages: ["English", "Spanish", "Quechua"],
      specialties: ["Inca trails", "High-altitude trekking", "Andean culture"],
      img: p("photo-1504257432389-52343af06ae3"),
    },
    gallery: [
      u("photo-1526392060635-9d6019884377"),
      u("photo-1531968455001-5c5272a41129"),
      u("photo-1501785888041-af3ef285b470"),
    ],
  },
};

export const getItinerary = (slug) => ITINERARY_DATA[slug] || null;