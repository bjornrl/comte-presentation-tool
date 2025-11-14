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
function extractBulletPoints(html = "") {
  // Extract text from <li> tags in HTML, return first 3
  if (!html) return [];
  const liMatches = html.match(/<li[^>]*>(.*?)<\/li>/gi);
  if (!liMatches) return [];
  return liMatches
    .slice(0, 3)
    .map((li) => {
      // Remove HTML tags and clean up
      return li
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
    })
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
    readCSV("Services.csv"), // optional: provides category blurbs
  ]);

// ---- Map Work.csv
const projects = workRows.map((row) => {
  // Handle both old and new CSV formats
  const id =
    get(row, ["Project number", "project number", "id"]) ||
    slugify(get(row, ["slug", "Slug"]));
  const title = get(row, ["title", "Title"]);
  const excerpt = get(row, ["project", "Project", "Innledning"]);
  const solution = get(row, ["Løsningen"]);
  const results = get(row, ["Resultater"]);
  const bulletPoints = extractBulletPoints(results);

  // Categories: try old format first, then derive from services if needed
  let categories = splitList(get(row, ["categories", "Categories"]));

  const images = [
    asImageUrl(
      get(row, ["cover (image)", "cover", "Cover (image)", "Cover Image"])
    ),
    asImageUrl(get(row, ["image 1", "Image 1"])),
    asImageUrl(get(row, ["image 2", "Image 2"])),
    asImageUrl(get(row, ["image 3", "Image 3"])),
    asImageUrl(get(row, ["image 4", "Image 4"])),
  ].filter(Boolean);

  const client = get(row, ["client", "Client", "Kunde"]);
  const location = get(row, ["Lokasjon", "Location", "location"]);
  const industry = get(row, ["Industri", "Industry", "industry"]);
  const stat1 = get(row, ["Stat 1", "stat 1"]);
  const stat2 = get(row, ["Stat 2", "stat 2"]);

  // Get Tjenester field (should contain category names from Services.csv)
  const tjenesterField = get(row, ["Tjenester", "Ekspertise"]);

  // Services: try old format first, then new format
  let services = [
    ...splitList(get(row, ["services", "Services"])),
    ...splitList(get(row, ["services 2", "Services 2"])),
  ];

  const year = get(row, ["year", "Year", "År"]);
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
    solution,
    bulletPoints,
    categories,
    images,
    client,
    year,
    location,
    industry,
    stat1,
    stat2,
    services,
    next,
    created,
    edited,
    _tjenester: tjenesterField, // Store temporarily for processing
  };
});

// Build category-to-services mapping from Services.csv
const categoryToServices = new Map();
const serviceToCategory = new Map();
if (categoryRows && categoryRows.length > 0) {
  for (const row of categoryRows) {
    const categoryTitle = get(row, ["title", "Title"]).trim();
    const expertiseList = splitList(get(row, ["expertise", "Expertise"]));
    categoryToServices.set(categoryTitle, expertiseList);
    // Also build reverse mapping for backward compatibility
    for (const service of expertiseList) {
      serviceToCategory.set(service.trim(), categoryTitle);
    }
  }
}

// Process Tjenester field: if it contains category names, expand to services
// Also set categories from Tjenester field
for (const p of projects) {
  const tjenesterValue = p._tjenester;
  if (tjenesterValue) {
    const tjenesterList = splitList(tjenesterValue);
    const foundCategories = [];
    const foundServices = new Set();

    // Check if values are category names or individual services
    for (const item of tjenesterList) {
      const trimmed = item.trim();
      // Check if it's a category name
      if (categoryToServices.has(trimmed)) {
        foundCategories.push(trimmed);
        // Expand category to its services
        const servicesForCategory = categoryToServices.get(trimmed);
        for (const service of servicesForCategory) {
          foundServices.add(service.trim());
        }
      } else if (serviceToCategory.has(trimmed)) {
        // It's an individual service, derive category
        const category = serviceToCategory.get(trimmed);
        if (!foundCategories.includes(category)) {
          foundCategories.push(category);
        }
        foundServices.add(trimmed);
      }
    }

    // Update project with categories and services
    if (foundCategories.length > 0) {
      p.categories = foundCategories;
    }
    if (foundServices.size > 0) {
      p.services = Array.from(foundServices);
    }
  }
  // Remove temporary field
  delete p._tjenester;
}

// Derive categories from services if categories are still missing (backward compatibility)
for (const p of projects) {
  if (p.categories.length === 0 && p.services.length > 0) {
    const derivedCategories = new Set();
    for (const service of p.services) {
      const category = serviceToCategory.get(service.trim());
      if (category) {
        derivedCategories.add(category);
      }
    }
    p.categories = Array.from(derivedCategories);
  }
}

// ---- Categories
// First, create categories from Services.csv (all categories should be available)
const catDataByTitle = new Map(
  (categoryRows || []).map((row) => {
    const title = get(row, ["title", "Title"]).trim();
    const stat1 = get(row, ["Stat 1", "stat 1"]).trim();
    const stat2 = get(row, ["Stat 2", "stat 2"]).trim();
    const stat3 = get(row, ["Stat 3", "stat 3"]).trim();
    const stats = [stat1, stat2, stat3].filter(Boolean);
    const statsDescription = get(row, ["Stats Description", "stats description", "StatsDescription"]).trim();
    return [
      title,
      {
        id: title,
        title: title,
        blurb: get(row, ["blurb", "Blurb"]).trim(),
        expertise: splitList(get(row, ["expertise", "Expertise"])),
        stats: stats.length > 0 ? stats : [get(row, ["stats", "Stats"]).trim()].filter(Boolean), // Fallback to old Stats column
        statsDescription: statsDescription,
      },
    ];
  })
);

// Also add categories found in projects (for backward compatibility)
const catMap = new Map(catDataByTitle);
for (const p of projects)
  for (const c of p.categories) {
    if (!catMap.has(c)) {
      catMap.set(c, { id: c, title: c, blurb: "" });
    }
  }

// Convert to array, prioritizing Services.csv data
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
