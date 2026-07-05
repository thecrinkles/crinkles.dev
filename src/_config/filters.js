// transforms a data string to a human readable format
export function readableDate(date) {
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// head of the list
export function head(list, n) {
  return list.slice(0, n);
}

export function index(list, n = 1) {
  return list[n];
}

// Get all tags, optionally with counts
export function getAllTags(collection, count = false) {
  let tags = {};
  for (let item of collection) {
    (item.data.tags || []).forEach((tag) => {
      if (tag === "all") return;
      if (tags[tag]) tags[tag]++;
      else tags[tag] = 1;
    });
  }

  return Object.entries(tags)
    .sort((a, b) => (a[1] < b[1] ? 1 : -1))
    .map((tag) => (count ? tag : tag[0]));
}

export function objectify(str, key) {
  if (!str) return null;
  return { [key]: str };
}

// --- search index -------------------------------------------------------

const STOPWORDS = new Set(
  "a an and are as at be but by for from has have how i in is it its of on or that the this to was were what when where which who will with you your".split(
    " ",
  ),
);

// code samples are noise for search
function stripCode(html) {
  if (!html) return "";
  return html
    .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
    .replace(/<code[\s\S]*?<\/code>/gi, " ");
}

// rendered HTML -> lowercased plain text
function stripToText(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// h2/h3 text, minus the markdown-it-anchor "#" permalink
function extractHeadings(html) {
  if (!html) return "";
  return (html.match(/<h[23][^>]*>[\s\S]*?<\/h[23]>/gi) || [])
    .map((h) =>
      h
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z0-9#]+;/gi, " ") // drop html entities (&lt; &gt; &amp; …)
        .replace(/#/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .join(" ");
}

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

// Build a compact, ranked search index: meta + headings + a per-post
// keyword "fingerprint" (top TF-IDF terms of the body, code stripped).
export function searchIndex(collection) {
  const docs = collection.map((post) => {
    const tf = {};
    for (const t of tokenize(stripToText(stripCode(post.templateContent))))
      tf[t] = (tf[t] || 0) + 1;
    return { post, tf };
  });

  const N = docs.length;
  const df = {};
  for (const { tf } of docs)
    for (const t in tf) df[t] = (df[t] || 0) + 1;

  return docs.map(({ post, tf }) => ({
    url: post.url,
    title: post.data.title,
    description: post.data.description || "",
    date: readableDate(post.data.date),
    tags: (post.data.tags || []).filter((t) => t !== "all"),
    headings: extractHeadings(post.templateContent),
    summary: Object.keys(tf)
      .map((t) => [t, tf[t] * Math.log(N / df[t])])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([t]) => t)
      .join(" "),
  }));
}
