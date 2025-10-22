/**
 * Generates initials from a full name
 * @param name - The full name to generate initials from
 * @returns A string containing the initials (max 2 characters)
 */
export function getInitials(name: string): string {
  if (!name || name.trim() === "") {
    return "U"; // Default for "User"
  }

  const names = name.trim().split(/\s+/);

  if (names.length === 1) {
    // Single name: take first two characters
    return names[0].substring(0, 2).toUpperCase();
  }

  // Multiple names: take first character of first and last name
  const firstInitial = names[0].charAt(0);
  const lastInitial = names[names.length - 1].charAt(0);

  return (firstInitial + lastInitial).toUpperCase();
}

/**
 * Formats display name ensuring proper capitalization
 * @param name - The name to format
 * @returns Properly formatted name
 */
export function formatDisplayName(name: string): string {
  if (!name || name.trim() === "") {
    return "User";
  }

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Checks if a URL is a valid image URL
 * @param url - The URL to validate
 * @returns Boolean indicating if the URL appears to be a valid image
 *
 * @example
 * isValidImageUrl("https://example.com/avatar.jpg") // true
 * isValidImageUrl("https://placeholder.svg") // false
 * isValidImageUrl("") // false
 * isValidImageUrl(null) // false
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || url.trim() === "") {
    return false;
  }

  // Check for common placeholder URLs that should be treated as no image
  const placeholderPatterns = [
    /placeholder/i,
    /example\.com/i,
    /avatar\.svg/i,
    /gravatar\.com.*d=blank/i,
  ];

  if (placeholderPatterns.some((pattern) => pattern.test(url))) {
    return false;
  }

  // Check for valid image extensions or common image hosting patterns
  const imagePatterns = [
    /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i,
    /googleapis\.com/i,
    /gravatar\.com/i,
    /githubusercontent\.com/i,
    /cloudinary\.com/i,
    /imgur\.com/i,
  ];

  return imagePatterns.some((pattern) => pattern.test(url));
}
