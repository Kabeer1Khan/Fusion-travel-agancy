const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

export const OVERVIEW_DATA = {
  bali: {
    description:
      "Discover Bali’s stunning coastlines, vibrant culture, and breathtaking landscapes. From world-class beaches to sacred temples, this 7-day journey blends adventure, relaxation and meaningful local experiences.",
    bestFor: "Wildlife, culture, beaches",
    itinerary: "Traveling & 7D 6N",
    nature: "Waterfalls & rice terraces",
    sustainability: "Responsible travel communities",
    img: u("photo-1518548419970-58e3b4079ab2"),
  },
  santorini: {
    description:
      "Wander whitewashed villages perched above a volcanic caldera, taste island wines and watch the famous sunsets from Oia. This 6-day escape blends scenic walks, sailing and slow Aegean evenings.",
    bestFor: "Sunsets, romance, wine",
    itinerary: "Island stays & 6D 5N",
    nature: "Volcanic cliffs & caldera views",
    sustainability: "Locally owned stays, small groups",
    img: u("photo-1613395877344-13d4a8e0d49e"),
  },
  maldives: {
    description:
      "Float between powder-white sandbars and glassy lagoons on a 6-day island-hopping escape. Snorkel vibrant reefs, sail at golden hour and unwind in barefoot luxury.",
    bestFor: "Snorkeling, relaxation, beaches",
    itinerary: "Island hopping & 6D 5N",
    nature: "Coral reefs & turquoise lagoons",
    sustainability: "Reef-safe gear & marine care",
    img: u("photo-1573843981267-be1999ff37cd"),
  },
  kyoto: {
    description:
      "Step into Japan’s ancient capital with 8 days of lantern-lit lanes, hidden temples and tea ceremonies. Cycle through bamboo groves and taste Kyoto’s legendary cuisine with local guides.",
    bestFor: "Culture, food, history",
    itinerary: "Cultural city & 8D 7N",
    nature: "Bamboo groves & mossy gardens",
    sustainability: "Family-run stays & local crafts",
    img: u("photo-1528360983277-13d401cdc186"),
  },
  "swiss-alps": {
    description:
      "Trek through glacial valleys, ride scenic railways and sleep beneath towering peaks. This 9-day alpine journey pairs panoramic trails with cosy mountain villages.",
    bestFor: "Hiking, views, fresh air",
    itinerary: "Mountain trails & 9D 8N",
    nature: "Glacial lakes & alpine meadows",
    sustainability: "Rail-first travel & mountain huts",
    img: u("photo-1530122037265-a5f1f91d3b99"),
  },
  "costa-rica": {
    description:
      "Hike misty rainforest trails, spot toucans and sloths, then unwind on wild Pacific beaches. This 8-day adventure puts you deep in one of the planet’s greenest, most biodiverse corners.",
    bestFor: "Wildlife, hiking, adventure",
    itinerary: "Eco lodges & 8D 7N",
    nature: "Rainforest & volcano hot springs",
    sustainability: "Conservation-funded lodges",
    img: u("photo-1518259102261-b40117eabbfc"),
  },
  portugal: {
    description:
      "Chase Atlantic swells, wander tiled coastal towns and finish days with grilled seafood at sunset. This 6-day route mixes surf coaching with cobbled-street culture.",
    bestFor: "Surf, coastal towns, food",
    itinerary: "Coastal road trip & 6D 5N",
    nature: "Golden cliffs & Atlantic beaches",
    sustainability: "Locally owned guesthouses",
    img: u("photo-1555881400-74d7acaacd8b"),
  },
  thailand: {
    description:
      "Hop between limestone islands, share street-food feasts and discover temples glowing at dusk. This 7-day journey balances island adventure with living Thai culture.",
    bestFor: "Islands, culture, food",
    itinerary: "Island hopping & 7D 6N",
    nature: "Limestone karsts & emerald bays",
    sustainability: "Community-run tours & reef care",
    img: u("photo-1552465011-b4e21bf6e79a"),
  },
  peru: {
    description:
      "Climb ancient Inca paths, wake above the clouds and explore the citadels of the Sacred Valley. This 10-day trek rewards you with high Andean views and deep local culture.",
    bestFor: "Hiking, history, ruins",
    itinerary: "Trekking & 10D 9N",
    nature: "Andean peaks & cloud forest",
    sustainability: "Porter welfare & small groups",
    img: u("photo-1531968455001-5c5272a41129"),
  },
};

export const getOverview = (slug) => OVERVIEW_DATA[slug] || null;