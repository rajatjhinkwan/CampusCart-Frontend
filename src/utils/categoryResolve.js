/** Map sell-flow UI labels to database category titles */

export const UI_TO_DB_PRODUCT = {
  Mobiles: "Electronics",
  Laptops: "Electronics",
  Cameras: "Electronics",
  "Gaming Consoles": "Electronics",
  "Headphones & Earbuds": "Electronics",
  "Monitors & Screens": "Electronics",
  "Musical Instruments": "Electronics",
  Fashion: "Clothing",
  Fitness: "Sports Equipment",
  Bikes: "Sports Equipment",
  "Study Table & Lamps": "Furniture",
  "Kitchen & Utensils": "Furniture",
  Electronics: "Electronics",
  Clothing: "Clothing",
  Books: "Books",
  Furniture: "Furniture",
  "Sports Equipment": "Sports Equipment",
};

export const UI_TO_DB_SERVICE = {
  "Video Editing": "Web Development",
  "Website Designing": "Web Development",
  "Graphic Designing": "Web Development",
  "UI/UX Designing": "Web Development",
  "Data Analysis": "Web Development",
  "Freelance Coding": "Web Development",
  "Social Media Management": "Event Planning",
  "Photography & Shoots": "Photography",
  "Tutoring / Teaching": "Tutoring",
  "Household Helpers (Shifting / Packing)": "Home Cleaning",
};

export function mapCategoryTitle(title, type = "product") {
  if (!title) return title;
  if (type === "service") {
    return UI_TO_DB_SERVICE[title] || title;
  }
  return UI_TO_DB_PRODUCT[title] || title;
}

const norm = (value) => String(value || "").trim().toLowerCase();

export function categoryIdString(cat) {
  if (!cat) return null;
  const id = cat._id ?? cat.id;
  return id ? String(id) : null;
}

export function hasParent(cat) {
  const parent = cat?.parent;
  return parent != null && parent !== "";
}

export function buildCategoryMap(categories = []) {
  const map = {};
  categories.forEach((cat) => {
    const id = categoryIdString(cat);
    if (!id) return;
    if (cat.title) map[cat.title] = id;
    if (cat.name) map[cat.name] = id;
  });
  return map;
}

/**
 * Resolve a UI label to a MongoDB category id for listing creation.
 */
export function resolveCategoryId(uiLabel, categories = [], type = "product") {
  if (!uiLabel || !Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  const mappedTitle = mapCategoryTitle(uiLabel, type);
  const map = buildCategoryMap(categories);

  const fromMap =
    map[uiLabel] ||
    map[mappedTitle] ||
    map[String(uiLabel).trim()];

  if (fromMap) return fromMap;

  const subs = categories.filter((cat) => cat.type === type && hasParent(cat));

  const exact = subs.find(
    (cat) =>
      norm(cat.title) === norm(mappedTitle) ||
      norm(cat.title) === norm(uiLabel)
  );
  if (exact) return categoryIdString(exact);

  const partial = subs.find(
    (cat) => {
      const title = norm(cat.title);
      const ui = norm(uiLabel);
      const mapped = norm(mappedTitle);
      return title.includes(ui) || ui.includes(title) || title.includes(mapped) || mapped.includes(title);
    }
  );
  if (partial) return categoryIdString(partial);

  const fallback = subs[0];
  return fallback ? categoryIdString(fallback) : null;
}
