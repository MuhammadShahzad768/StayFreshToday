export async function GET() {
  const site = "https://stayfreshtoday.com";

  // Get all WordPress posts
  const posts = await getAllPosts();

  const staticPages = [
    "/",
    "/about/",
    "/blog/",
    "/privacy-policy/",
    "/terms-and-conditions/",
  ];

  const urls = [
    ...staticPages.map((path) => `${site}${path}`),
  ...posts.map(
  (post) => `  <url>
    <loc>${site}/blog/${post.slug}/</loc>
    <lastmod>${post.modified}</lastmod>
    <priority>0.9</priority>
  </url>`
)
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join("\n")}
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