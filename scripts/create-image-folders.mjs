// scripts/create-image-folders.mjs
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Papa from "papaparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const IN = path.join(root, "cms");
const IMAGES_DIR = path.join(root, "public", "cms", "images");

// Extract filename from URL
function extractFilename(url) {
  if (!url || !url.trim()) return null;
  
  try {
    // Handle Next.js image URLs: /_next/image?url=%2Fimages%2Ffilename.png&w=3840&q=75
    if (url.includes("_next/image?url=")) {
      const urlMatch = url.match(/url=([^&]+)/);
      if (urlMatch) {
        const decoded = decodeURIComponent(urlMatch[1]);
        // Extract filename from path like /images/A4 - 139.png
        const filename = path.basename(decoded);
        return filename;
      }
    }
    
    // Handle regular URLs - get the last part after the last /
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = path.basename(pathname);
    
    // Decode URL-encoded filenames
    return decodeURIComponent(filename);
  } catch (e) {
    // If URL parsing fails, try to extract filename manually
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    return decodeURIComponent(lastPart.split("?")[0]);
  }
}

async function readCSV(name) {
  const full = path.join(IN, name);
  const txt = await readFile(full, "utf8");
  const parsed = Papa.parse(txt, { header: true, skipEmptyLines: true });
  return parsed.data;
}

async function main() {
  console.log("Reading Work.csv...");
  const rows = await readCSV("Work.csv");
  
  // Ensure images directory exists
  await mkdir(IMAGES_DIR, { recursive: true });
  
  for (const row of rows) {
    const slug = row.Slug?.trim();
    if (!slug) continue;
    
    // Extract image URLs - check both image columns and alt columns (CSV may have misalignment)
    const findImageUrl = (baseName) => {
      // Try the main column first
      let url = row[baseName] || row[baseName.toLowerCase()] || "";
      url = url.trim();
      
      // If empty or not a URL, try the alt column (sometimes URLs end up there due to CSV parsing issues)
      if (!url || !url.includes("http")) {
        const altUrl = row[`${baseName}:alt`] || row[`${baseName}:alt`.toLowerCase()] || "";
        const altUrlTrimmed = altUrl.trim();
        if (altUrlTrimmed && altUrlTrimmed.includes("http")) {
          url = altUrlTrimmed;
        }
      }
      
      return url;
    };
    
    const coverImage = findImageUrl("Cover Image");
    const image1 = findImageUrl("Image 1");
    const image2 = findImageUrl("Image 2");
    const image3 = findImageUrl("Image 3");
    const image4 = findImageUrl("Image 4");
    
    // Extract filenames
    const images = [
      { name: "Cover Image", url: coverImage },
      { name: "Image 1", url: image1 },
      { name: "Image 2", url: image2 },
      { name: "Image 3", url: image3 },
      { name: "Image 4", url: image4 },
    ]
      .map(({ name, url }) => ({
        name,
        filename: extractFilename(url),
        url,
      }))
      .filter((img) => img.filename && img.url);
    
    // Create folder for this slug
    const folderPath = path.join(IMAGES_DIR, slug);
    await mkdir(folderPath, { recursive: true });
    
    // Create README with image information
    const readmeContent = `# Images for ${slug}

This folder contains images for the project: ${row.Title || slug}

## Expected Images

${images.length > 0 ? images.map((img, idx) => `${idx + 1}. **${img.name}**: \`${img.filename}\`
   - Original URL: ${img.url}`).join("\n\n") : "No images specified in CSV."}

## Instructions

Place the image files in this folder with the exact filenames listed above.
`;
    
    await writeFile(
      path.join(folderPath, "README.md"),
      readmeContent,
      "utf8"
    );
    
    console.log(`✓ Created folder: ${slug} (${images.length} images)`);
  }
  
  console.log(`\n✅ Done! Created ${rows.length} folders in ${IMAGES_DIR}`);
}

main().catch(console.error);

