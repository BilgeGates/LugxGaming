/**
 * Date formatting utilities - Professional version
 */

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.getFullYear();
  } catch {
    return "N/A";
  }
};

export const formatTimeAgo = (dateValue) => {
  if (!dateValue) return "N/A";

  try {
    let date;

    if (typeof dateValue === "number") {
      if (String(dateValue).length === 10) {
        date = new Date(dateValue * 1000);
      } else {
        date = new Date(dateValue);
      }
    } else {
      date = new Date(dateValue);
    }

    if (isNaN(date.getTime())) {
      return "N/A";
    }

    const now = new Date();
    const diffInMs = now - date;

    if (diffInMs < 0) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12)
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  } catch (error) {
    console.error("formatTimeAgo error:", error);
    return "N/A";
  }
};

/**
 * Professional release date formatting - MM.DD.YYYY format
 */
export const formatReleaseDate = (dateString) => {
  if (!dateString) return "TBA";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBA";

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}.${day}.${year}`;
  } catch {
    return "TBA";
  }
};

/**
 * Alternative professional formats
 */
export const formatReleaseDateLong = (dateString) => {
  if (!dateString) return "To Be Announced";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "To Be Announced";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "To Be Announced";
  }
};

export const formatReleaseDateShort = (dateString) => {
  if (!dateString) return "TBA";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBA";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "TBA";
  }
};

/**
 * Professional release date with status badge
 */
export const formatReleaseDateWithStatus = (dateString) => {
  const formattedDate = formatReleaseDate(dateString);
  const status = getGameStatus(dateString);

  return {
    date: formattedDate,
    ...status,
  };
};

/**
 * Enhanced game status with professional styling
 */
export const getGameStatus = (releaseDate) => {
  if (!releaseDate) {
    return {
      status: "upcoming",
      text: "Coming Soon",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
    };
  }

  try {
    const release = new Date(releaseDate);
    if (isNaN(release.getTime())) {
      return {
        status: "unknown",
        text: "TBA",
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        borderColor: "border-gray-500/30",
      };
    }

    const now = new Date();
    const daysDiff = (now - release) / (1000 * 60 * 60 * 24);

    if (daysDiff < 0) {
      const daysUntilRelease = Math.abs(Math.ceil(daysDiff));
      return {
        status: "upcoming",
        text:
          daysUntilRelease <= 30
            ? `${daysUntilRelease} days left`
            : "Coming Soon",
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-500/30",
      };
    }

    if (daysDiff <= 7) {
      return {
        status: "new",
        text: "Just Released",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/20",
        borderColor: "border-emerald-500/30",
      };
    }

    if (daysDiff <= 30) {
      return {
        status: "new",
        text: "New Release",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/30",
      };
    }

    if (daysDiff <= 365) {
      return {
        status: "recent",
        text: "Recent",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/30",
      };
    }

    if (daysDiff <= 1825) {
      // 5 years
      return {
        status: "established",
        text: "Popular",
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
        borderColor: "border-orange-500/30",
      };
    }

    return {
      status: "classic",
      text: "Classic",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
    };
  } catch {
    return {
      status: "unknown",
      text: "TBA",
      color: "text-gray-400",
      bgColor: "bg-gray-500/20",
      borderColor: "border-gray-500/30",
    };
  }
};

/**
 * Get relative time for release dates
 */
export const getRelativeReleaseTime = (dateString) => {
  if (!dateString) return "Release date unknown";

  try {
    const release = new Date(dateString);
    if (isNaN(release.getTime())) return "Release date unknown";

    const now = new Date();
    const diffInMs = release - now;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) {
      if (diffInDays <= 7)
        return `Releases in ${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
      if (diffInDays <= 30)
        return `Releases in ${Math.ceil(diffInDays / 7)} week${
          diffInDays > 7 ? "s" : ""
        }`;
      if (diffInDays <= 365)
        return `Releases in ${Math.ceil(diffInDays / 30)} month${
          diffInDays > 30 ? "s" : ""
        }`;
      return `Releases in ${Math.ceil(diffInDays / 365)} year${
        diffInDays > 365 ? "s" : ""
      }`;
    } else {
      const daysSinceRelease = Math.abs(diffInDays);
      if (daysSinceRelease === 0) return "Released today";
      if (daysSinceRelease === 1) return "Released yesterday";
      if (daysSinceRelease <= 7) return `Released ${daysSinceRelease} days ago`;
      if (daysSinceRelease <= 30)
        return `Released ${Math.ceil(daysSinceRelease / 7)} weeks ago`;
      if (daysSinceRelease <= 365)
        return `Released ${Math.ceil(daysSinceRelease / 30)} months ago`;
      return `Released ${Math.ceil(daysSinceRelease / 365)} years ago`;
    }
  } catch {
    return "Release date unknown";
  }
};

/**
 * Format date for different locales
 * @param {string} dateString - Date string
 * @param {string} locale - Locale code (default: 'en-US')
 * @param {string} format - Format type ('short', 'long', 'professional')
 * @returns {string} Formatted date
 */
export const formatDateLocale = (
  dateString,
  locale = "en-US",
  format = "professional"
) => {
  if (!dateString) return "TBA";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBA";

    switch (format) {
      case "professional":
        // MM.DD.YYYY format regardless of locale for consistency
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}.${day}.${year}`;

      case "long":
        return date.toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

      case "short":
        return date.toLocaleDateString(locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

      default:
        return formatReleaseDate(dateString);
    }
  } catch {
    return "TBA";
  }
};

// Export default professional formatter
export default formatReleaseDate;
