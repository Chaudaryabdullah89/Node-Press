const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clean the database in order
  await prisma.postTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.author.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  console.log("1. Creating Categories...");
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Design", slug: "design" } }),
    prisma.category.create({ data: { name: "Technology", slug: "technology" } }),
    prisma.category.create({ data: { name: "Lifestyle", slug: "lifestyle" } }),
    prisma.category.create({ data: { name: "Insights", slug: "insights" } }),
    prisma.category.create({ data: { name: "News", slug: "news" } }),
  ]);

  console.log("2. Creating Tags...");
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Architecture", slug: "architecture" } }),
    prisma.tag.create({ data: { name: "Minimalism", slug: "minimalism" } }),
    prisma.tag.create({ data: { name: "Technology", slug: "tech" } }),
    prisma.tag.create({ data: { name: "Quantum", slug: "quantum" } }),
    prisma.tag.create({ data: { name: "Sustainability", slug: "sustainability" } }),
    prisma.tag.create({ data: { name: "Food", slug: "food" } }),
    prisma.tag.create({ data: { name: "AI", slug: "ai" } }),
    prisma.tag.create({ data: { name: "Journalism", slug: "journalism" } }),
    prisma.tag.create({ data: { name: "Remote Work", slug: "remote-work" } }),
  ]);

  console.log("3. Creating Users & Authors...");
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "julian@example.com",
        password: hashedPassword,
        username: "julian_voss",
        name: "Julian Voss",
        role: "AUTHOR",
        avatar: "https://i.pravatar.cc/150?u=julian",
      },
    }),
    prisma.user.create({
      data: {
        email: "elena@example.com",
        password: hashedPassword,
        username: "elena_rod",
        name: "Elena Rodriguez",
        role: "AUTHOR",
        avatar: "https://i.pravatar.cc/150?u=elena",
      },
    }),
  ]);

  const authors = await Promise.all(
    users.map((u, i) =>
      prisma.author.create({
        data: {
          userId: u.id,
          username: u.username,
          bio: i === 0 ? "Minimalist architect and urban designer." : "Quantum computing researcher.",
          avatar: u.avatar,
        },
      })
    )
  );

  // 4. Content Libraries for Random Generation
  const titles = [
    "The Future of {topic}",
    "Why {topic} is Changing Everything",
    "10 Things You Didn't Know About {topic}",
    "Mastering {topic}: A Complete Guide",
    "The Hidden Truth Behind {topic}",
    "How {topic} is Reshaping Our World",
    "Exploring the Depths of {topic}",
    "The Evolution of {topic}",
  ];

  const topics = [
    "Modern Web Design", "Edge Computing", "Minimalist Living", 
    "Sustainable Energy", "Artificial Intelligence", "Digital Privacy",
    "Urban Planning", "Cryptography", "Gourmet Cooking", "Remote Collaboration"
  ];

  const images = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800"
  ];

  console.log("4. Generating 60 bulk posts...");

  for (let i = 1; i <= 60; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const titleTemplate = titles[Math.floor(Math.random() * titles.length)];
    const title = titleTemplate.replace("{topic}", topic) + ` (Vol. ${i})`;
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}-${i}`;
    
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: `A deep dive into ${topic} and its implications for the future of our society.`,
        content: `Full article content about ${topic} goes here. In this extensive piece, we discuss how ${topic} has evolved over the past decade. The impact on daily life is significant, and experts agree that the next five years will be crucial for the development of ${topic}...`.repeat(5),
        imageUrl: images[Math.floor(Math.random() * images.length)],
        authorId: authors[Math.floor(Math.random() * authors.length)].id,
        categoryId: categories[Math.floor(Math.random() * categories.length)].id,
        isFeatured: i <= 5,
        published: true,
        status: "PUBLISHED",
        viewCount: Math.floor(Math.random() * 5000),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
      },
    });

    // Link 1-3 random tags
    const randomTags = tags
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    await prisma.postTag.createMany({
      data: randomTags.map(t => ({ postId: post.id, tagId: t.id }))
    });

    if (i % 5 === 0) {
        const percentage = Math.round((i / 60) * 100);
        console.log(`Progress: ${percentage}% | Created ${i}/60 posts...`);
    }
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
