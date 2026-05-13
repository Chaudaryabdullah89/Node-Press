export const MOCK_POSTS = [
  {
    id: "np1",
    title: "The Renaissance of Minimalist Architecture in Urban Spaces",
    slug: "renaissance-minimalist-architecture",
    excerpt: "How modern architects are reclaiming city skylines with 'less is more' philosophy, focusing on light, space, and raw materials.",
    content: "Minimalism in architecture is more than just clean lines. It's a response to the chaotic density of modern urban life. In this deep dive, we explore how designers are using sustainable concrete, vast glass panels, and negative space to create sanctuaries of peace in the middle of bustling metropolises.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
    createdAt: new Date().toISOString(),
    categories: [{ category: { name: "Design", slug: "design" } }],
    author: {
      name: "Julian Voss",
      username: "julian_voss",
      avatar: "https://i.pravatar.cc/150?u=julian",
    },
    viewCount: 1240,
  },
  {
    id: "np2",
    title: "Quantum Computing: The Next Decade of Cryptography",
    slug: "quantum-computing-cryptography",
    excerpt: "As quantum superiority nears, the way we protect our data must evolve. Discover the world of post-quantum encryption.",
    content: "The promise of quantum computing brings with it a terrifying reality: current encryption standards like RSA will become obsolete overnight. We talk to cybersecurity experts about the transition to lattice-based cryptography and how the world's leading tech giants are preparing for the 'Q-Day'.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    categories: [{ category: { name: "Technology", slug: "technology" } }],
    author: {
      name: "Elena Rodriguez",
      username: "elena_rod",
      avatar: "https://i.pravatar.cc/150?u=elena",
    },
    viewCount: 850,
  },
  {
    id: "np3",
    title: "Sustainable Gastronomy: From Farm to Fine Dining",
    slug: "sustainable-gastronomy",
    excerpt: "Meet the chefs who are ditching imports and global supply chains to build seasonal, zero-waste menus that tell a story.",
    content: "The culinary world is undergoing a silent revolution. Fine dining is no longer about exotic ingredients flown across continents; it's about the dirt under the fingernails of local farmers. This article explores the rise of hyper-local sourcing and the artistry behind zero-waste cooking techniques.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    categories: [{ category: { name: "Lifestyle", slug: "lifestyle" } }],
    author: {
      name: "Marcus Thorne",
      username: "chef_marcus",
      avatar: "https://i.pravatar.cc/150?u=marcus",
    },
    viewCount: 2100,
  },
  {
    id: "np4",
    title: "The Psychology of Creative Flow and Peak Performance",
    slug: "psychology-creative-flow",
    excerpt: "What happens in the brain when we lose track of time? Understanding the 'Flow' state to boost productivity and happiness.",
    content: "Being 'in the zone' is a neurological phenomenon. We look at the work of Mihaly Csikszentmihalyi and recent fMRI studies to understand how we can intentionally trigger flow states in our daily work. From environment design to micro-challenges, learn the triggers of peak human performance.",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    categories: [{ category: { name: "Self Improvement", slug: "self-improvement" } }],
    author: {
      name: "Sarah Jenkins",
      username: "sarah_j",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    viewCount: 3400,
  },
  {
    id: "np5",
    title: "Digital Nomadism: The End of the Traditional Office?",
    slug: "digital-nomadism-future",
    excerpt: "Remote work was just the beginning. The new generation of workers is trading desks for the world, but at what cost?",
    content: "The concept of a 'home office' is being replaced by 'global offices'. While the freedom is intoxicating, the impact on local economies and the personal sense of community is complex. We interview nomads from Lisbon to Bali to see the reality behind the filtered Instagram posts.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    categories: [{ category: { name: "Culture", slug: "culture" } }],
    author: {
      name: "Liam O'Connor",
      username: "liam_nomad",
      avatar: "https://i.pravatar.cc/150?u=liam",
    },
    viewCount: 1560,
  }
];

export const MOCK_COMMENTS = [
  {
    id: "c1",
    postId: "np1",
    content: "This is a fascinating take on modern architecture. The focus on raw materials really resonates with current sustainability trends.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    user: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/150?u=alex",
    }
  },
  {
    id: "c2",
    postId: "np1",
    content: "I completely agree! I've seen some of these buildings in Berlin and they are even more stunning in person.",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    user: {
      name: "Sophia Chen",
      avatar: "https://i.pravatar.cc/150?u=sophia",
    }
  },
  {
    id: "c3",
    postId: "np1",
    content: "Great article. Would love to see a follow-up on how this affects residential design in smaller cities.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    user: {
      name: "Marcus Thorne",
      avatar: "https://i.pravatar.cc/150?u=marcus",
    }
  },
  {
    id: "c4",
    postId: "np2",
    content: "Quantum cryptography is definitely the next big frontier. Scares me a bit how fast things are moving though!",
    createdAt: new Date().toISOString(),
    user: {
      name: "Jordan Lee",
      avatar: "https://i.pravatar.cc/150?u=jordan",
    }
  }
];
