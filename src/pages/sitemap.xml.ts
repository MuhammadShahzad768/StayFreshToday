export async function GET() {
  const site = "https://stayfreshtoday.com";

  // Get all WordPress posts
  const posts = await getAllPosts();

  // Static pages
  const staticPages = [
    {
      url: "/",
      lastmod: "2026-08-24T00:00:00+00:00",
      priority: "1.0",
    },
    {
      url: "/about/",
      lastmod: "2026-08-20T00:00:00+00:00",
      priority: "0.8",
    },
    {
      url: "/blog/",
      lastmod: "2026-08-24T00:00:00+00:00",
      priority: "0.9",
    },
    {
      url: "/privacy-policy/",
      lastmod: "2026-08-20T00:00:00+00:00",
      priority: "0.5",
    },
    {
      url: "/terms-and-conditions/",
      lastmod: "2026-08-20T00:00:00+00:00",
      priority: "0.5",
    },
  ];

  const urls = [
    // Static pages
    ...staticPages.map(
      (page) => `  <url>
    <loc>${site}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`
    ),

    // WordPress posts
    ...posts.map(
      (post) => `  <url>
    <loc>${site}/blog/${post.slug}/</loc>
    <lastmod>${post.modified}</lastmod>
    <priority>0.9</priority>
  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.join("\n")}

</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

async function getAllPosts() {
  const posts = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://admin.stayfreshtoday.com/wp-json/wp/v2/posts?per_page=100&page=${page}`
    );

    if (!response.ok) {
      break;
    }

    const data = await response.json();

    posts.push(...data);

    if (data.length < 100) {
      break;
    }

    page++;
  }

  return posts;
}