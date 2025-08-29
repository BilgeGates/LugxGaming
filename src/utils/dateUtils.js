/**
 * Date formatting utilities - Updated version
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

export const formatReleaseDate = (dateString) => {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown";
  }
};

export const getGameStatus = (releaseDate) => {
  if (!releaseDate) {
    return { status: "upcoming", text: "Coming Soon", color: "text-blue-400" };
  }

  try {
    const release = new Date(releaseDate);
    if (isNaN(release.getTime())) {
      return { status: "unknown", text: "Unknown", color: "text-gray-400" };
    }

    const now = new Date();
    const daysDiff = (now - release) / (1000 * 60 * 60 * 24);

    if (daysDiff < 0) {
      return {
        status: "upcoming",
        text: "Coming Soon",
        color: "text-blue-400",
      };
    }

    if (daysDiff <= 30) {
      return { status: "new", text: "New Release", color: "text-green-400" };
    }

    if (daysDiff <= 365) {
      return { status: "recent", text: "Recent", color: "text-yellow-400" };
    }

    return { status: "classic", text: "Classic", color: "text-gray-400" };
  } catch {
    return { status: "unknown", text: "Unknown", color: "text-gray-400" };
  }
};
