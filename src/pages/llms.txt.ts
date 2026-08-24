export async function GET() {
  const site = "https://stayfreshtoday.com";

  const posts = await getAllPosts();

  const content = `# StayFreshToday

> StayFreshToday is a health, wellness, beauty, and lifestyle blog.

## Main Pages

- [Home](${site}/)
- [About](${site}/about/)
- [Blog](${site}/blog/)
- [Privacy Policy](${site}/privacy-policy/)
- [Terms and Conditions](${site}/terms-and-conditions/)

## Blog Posts

${posts
  .map(
    (post) =>
      `- [${stripHtml(post.title.rendered)}](${site}/blog/${post.slug}/)`
  )
  .join("\n")}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

async function getAllPosts() {
  const posts: any[] = [];
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

function stripHtml(text: string) {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .trim();
}