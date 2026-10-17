const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const CATEGORIES = ["All", "Destinations", "Tips", "Backpacking", "Culture"];

export const ARTICLES = [
  {
    id: "packing-tips",
    category: "Backpacking",
    title: "10 Essential Packing Tips for Sustainable Travel",
    date: "Apr 24, 2025",
    read: "6 min read",
    img: u("photo-1553062407-98eeb64c6a62"),
    body: [
      "Pack light, pack once: choose versatile layers, a reusable water bottle, a solid shampoo bar and a small repair kit. Every kilo you skip saves fuel on flights and transfers.",
      "Bring reef-safe sunscreen and a compact tote for market shopping, and leave single-use plastics at home. A little planning means less waste on the road and more room for local finds.",
    ],
  },
  {
    id: "best-time-bali",
    category: "Destinations",
    title: "The Best Time to Visit Bali",
    date: "Apr 18, 2025",
    read: "5 min read",
    img: u("photo-1537996194471-e657df975ab4"),
    body: [
      "Bali’s dry season, from April to October, brings sunny skies, calm seas and the best surf conditions on the west coast. July and August are the busiest months, so book early if you want quiet beaches.",
      "For fewer crowds and lush rice terraces, aim for the shoulder months of April–May or September. The wet season is greener and cheaper, with short afternoon showers that rarely spoil a day.",
    ],
  },
  {
    id: "bali-cultural-village",
    category: "Culture",
    title: "What to Expect in a Bali Cultural Village",
    date: "Apr 16, 2025",
    read: "7 min read",
    img: u("photo-1518548419970-58e3b4079ab2"),
    body: [
      "Traditional villages across Bali still live by temple calendars, shared ceremonies and handed-down crafts. Visitors are welcome at many of them, especially when they arrive with a local guide.",
      "Expect a sarong at the gate, offerings on every doorstep and warm invitations to try weaving, gamelan music or home cooking. Ask before taking photos and join in respectfully.",
    ],
  },
  {
    id: "travel-cheap-local",
    category: "Tips",
    title: "How to Travel Cheap & Local Communities",
    date: "Apr 12, 2025",
    read: "5 min read",
    img: u("photo-1488646953014-85cb44e25828"),
    body: [
      "Traveling cheaply does not mean cutting corners. Locally owned guesthouses, market meals and shared transport cost less and put your money straight into the community.",
      "Travel in the shoulder season, walk or cycle where you can, and book tours run by local families. You will spend less, meet more people and leave a lighter footprint.",
    ],
  },
  {
    id: "hidden-beaches",
    category: "Destinations",
    title: "Top 5 Hidden Beaches in Indonesia",
    date: "Apr 10, 2025",
    read: "6 min read",
    img: u("photo-1507525428034-b723cf961d3e"),
    body: [
      "Beyond the famous resorts, Indonesia hides coves reachable only by short hikes or small boats. Look to Nusa Penida, Lombok’s south coast and the quiet corners of Sumba.",
      "Go early, carry water and take your rubbish with you. A local guide can point out safe swimming spots and tide times, and the walk down is half the reward.",
    ],
  },
  {
    id: "packing-checklist",
    category: "Backpacking",
    title: "Sustainable Travel Packing Checklist",
    date: "Apr 7, 2025",
    read: "4 min read",
    img: u("photo-1527631746610-bca00a040d60"),
    body: [
      "Start with the basics: passport copies, a lightweight rain jacket, quick-dry clothes and a refillable bottle. Add a solar charger, reusable cutlery and a small first-aid kit.",
      "Tick everything off the night before and weigh your bag. If it is over 8 kilos, put something back. Your shoulders and the planet will thank you.",
    ],
  },
];