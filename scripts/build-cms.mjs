// scripts/build-cms.mjs
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants as FS } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Papa from "papaparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, ".."); // project root (one up from /scripts)
const IN = path.join(root, "cms"); // your CSVs folder
const OUT = path.join(root, "public", "cms"); // output folder

function normalizeKey(k = "") {
  return k
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_æøå]/gi, "");
}
function findKey(row, variants) {
  const keys = Object.keys(row);
  const norm = new Map(keys.map((k) => [normalizeKey(k), k]));
  for (const v of variants) {
    const hit = norm.get(normalizeKey(v));
    if (hit) return hit;
  }
  return null;
}
function get(row, variants, dflt = "") {
  const k = findKey(row, variants);
  const v = k ? row[k] : undefined;
  return (v ?? dflt).toString().trim();
}
async function exists(p) {
  try {
    await access(p, FS.R_OK);
    return true;
  } catch {
    return false;
  }
}
async function readCSV(name) {
  const full = path.join(IN, name);
  if (!(await exists(full))) {
    console.warn(`⚠ Missing CSV: ${full}`);
    return [];
  }
  const txt = await readFile(full, "utf8");
  if (!txt.trim()) {
    console.warn(`⚠ Empty CSV: ${full}`);
    return [];
  }
  const { data, meta, errors } = Papa.parse(txt, {
    header: true,
    skipEmptyLines: true,
    delimiter: ",",
    quoteChar: '"',
  });
  if (errors?.length) {
    console.warn(
      `⚠ PapaParse found ${errors.length} error(s) in ${name}`,
      errors.slice(0, 3)
    );
  }
  console.log(
    `• Read ${data.length} row(s) from ${name} (columns: ${
      meta?.fields?.join(", ") || "unknown"
    })`
  );
  return /** @type {Record<string,string>[]} */ (data);
}
function splitList(cell = "") {
  // You confirmed comma-separated lists
  return cell
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
function asImageUrl(s) {
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s.trim();
  return `/cms/${s.trim()}`;
}
function slugify(s, fallback = "") {
  const txt = (s || fallback || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return txt || Math.random().toString(36).slice(2, 8);
}

// ---- Load
const [teamRows, clientRows, blogRows, workRows, categoryRows] =
  await Promise.all([
    readCSV("Team.csv"),
    readCSV("Clients.csv"),
    readCSV("Blog.csv"),
    readCSV("Work.csv"),
    readCSV("Categories.csv"), // optional: provides category blurbs
  ]);

// ---- Map Work.csv
const projects = workRows.map((row) => {
  const id =
    get(row, ["Project number", "project number", "id"]) ||
    slugify(get(row, ["slug"]));
  const title = get(row, ["title", "Title"]);
  const excerpt = get(row, ["project", "Project"]);
  const categories = splitList(get(row, ["categories", "Categories"]));

  const images = [
    asImageUrl(get(row, ["cover (image)", "cover", "Cover (image)"])),
    asImageUrl(get(row, ["image 1", "Image 1"])),
    asImageUrl(get(row, ["image 2", "Image 2"])),
    asImageUrl(get(row, ["image 3", "Image 3"])),
    asImageUrl(get(row, ["image 4", "Image 4"])),
  ].filter(Boolean);

  const client = get(row, ["client", "Client"]);
  const services = [
    ...splitList(get(row, ["services", "Services"])),
    ...splitList(get(row, ["services 2", "Services 2"])),
  ];
  const year = get(row, ["year", "Year"]);
  const next = [
    get(row, ["next project 1", "Next project 1"]),
    get(row, ["next project 2", "Next project 2"]),
    get(row, ["next project 3", "Next project 3"]),
  ].filter(Boolean);
  const slug = slugify(get(row, ["slug", "Slug"]), title || id);
  const created = get(row, ["created", "Created"]);
  const edited = get(row, ["edited", "Edited"]);

  return {
    id,
    slug,
    title,
    excerpt,
    categories,
    images,
    client,
    year,
    services,
    next,
    created,
    edited,
  };
});

// ---- Categories
const catMap = new Map();
for (const p of projects)
  for (const c of p.categories) {
    if (!catMap.has(c)) catMap.set(c, { id: c, title: c, blurb: "" });
  }

// Merge blurbs, expertise, and stats from Categories.csv if present
const catDataByTitle = new Map(
  (categoryRows || []).map((row) => [
    get(row, ["title", "Title"]).trim(),
    {
      blurb: get(row, ["blurb", "Blurb"]).trim(),
      expertise: splitList(get(row, ["expertise", "Expertise"])),
      stats: get(row, ["stats", "Stats"]).trim(),
    },
  ])
);
const categories = [...catMap.values()].map((c) => {
  const catData = catDataByTitle.get(c.title) || {};
  return {
    ...c,
    blurb: catData.blurb || c.blurb || "",
    expertise: catData.expertise || [],
    stats: catData.stats || "",
  };
});

// ---- Blog.csv
const blogPre = blogRows.map((row) => {
  const slug = slugify(get(row, ["Slug"]), get(row, ["Title"]));
  const id = slug;
  const number = get(row, ["Blog Number"]);
  const title = get(row, ["Title"]);
  const cover = asImageUrl(get(row, ["Cover"]));
  const coverAlt = get(row, ["Cover:alt", "Cover alt", "Cover_alt"]);
  const date = get(row, ["Date"]);
  const author = get(row, ["Author"]);
  const contentHTML = get(row, ["Content"]);
  const nextNums = [
    get(row, ["Next Blog 1"]),
    get(row, ["Next Blog 2"]),
    get(row, ["Next Blog 3"]),
  ].filter(Boolean);
  const created = get(row, ["created", "Created"]);
  const edited = get(row, ["edited", "Edited"]);
  return {
    id,
    slug,
    number,
    title,
    cover,
    coverAlt,
    date,
    author,
    contentHTML,
    nextNums,
    created,
    edited,
  };
});
const byNumber = new Map(blogPre.map((b) => [b.number, b]));
const blog = blogPre
  .map((b) => ({
    id: b.id,
    slug: b.slug,
    title: b.title,
    cover: b.cover,
    coverAlt: b.coverAlt,
    date: b.date,
    author: b.author,
    contentHTML: b.contentHTML,
    next: b.nextNums
      .map((n) => byNumber.get(n))
      .filter(Boolean)
      .map((nb) => nb.slug),
    created: b.created,
    edited: b.edited,
  }))
  .sort(
    (a, b) =>
      Date.parse(b.date || "1970-01-01") - Date.parse(a.date || "1970-01-01")
  );

// ---- Clients.csv
const clients = clientRows.map((row) => {
  const title = get(row, ["title", "Title"]);
  const slug = slugify(get(row, ["slug", "Slug"]), title);
  const logo = asImageUrl(get(row, ["logo", "Logo"]));
  const created = get(row, ["created", "Created"]);
  const edited = get(row, ["edited", "Edited"]);
  return { title, slug, logo, created, edited };
});

// ---- Team.csv
const team = teamRows.map((row) => {
  const name = get(row, ["Navn", "navn", "Name", "name"]);
  const slug = slugify(get(row, ["slug", "Slug"]), name);
  const role = get(row, ["stilling", "Stilling", "role", "Role"]);
  const expertise = splitList(
    get(row, ["ekspertise", "Ekspertise", "expertise"])
  );
  const linkedin = get(row, ["linkedin", "LinkedIn"]);
  const mail = get(row, ["mail", "e-post", "email", "Email"]);
  const imgMain = asImageUrl(get(row, ["hovedbilde", "Hovedbilde"]));
  const imgAlt = asImageUrl(
    get(row, ["ekstrabilde", "Ekstrabilde", "hovedbilde ekstrabilde"])
  );
  const created = get(row, ["created", "Created"]);
  const edited = get(row, ["edited", "Edited"]);
  return {
    name,
    slug,
    role,
    expertise,
    linkedin,
    mail,
    images: [imgMain, imgAlt].filter(Boolean),
    created,
    edited,
  };
});

// ---- Summarize + Write
const out = { categories, projects, blog, clients, team };
await mkdir(OUT, { recursive: true });

const totals = {
  categories: categories.length,
  projects: projects.length,
  blog: blog.length,
  clients: clients.length,
  team: team.length,
};
console.log("Output counts:", totals);

if (
  !projects.length &&
  !categories.length &&
  !blog.length &&
  !clients.length &&
  !team.length
) {
  console.error("✗ Nothing to write – check that your CSV files are in:", IN);
  process.exit(1);
}

await writeFile(
  path.join(OUT, "data.json"),
  JSON.stringify(out, null, 2),
  "utf8"
);
console.log("✓ Wrote", path.join(OUT, "data.json"));
