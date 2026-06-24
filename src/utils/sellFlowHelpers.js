/** Minimum photos required to proceed / submit in the sell flow */

export function getMinPhotosForCategory(categoryType) {
  if (categoryType === "Product") {
    return import.meta.env.DEV ? 1 : 4;
  }
  return 0;
}

export function getPhotoHintForCategory(categoryType) {
  if (categoryType === "Product") {
    return import.meta.env.DEV
      ? "Add at least 1 clear photo of your item."
      : "Upload at least 4 clear photos from front, back, left and right side.";
  }
  return "Photos are optional — add one or more to help buyers trust your listing.";
}
