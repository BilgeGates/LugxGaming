/**
 * Date formatting utilities
 */

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).getFullYear();
  } catch {
    return "N/A";
  }
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  } catch {
    return "N/A";
  }
};

export const formatReleaseDate = (dateString) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getGameStatus = (releaseDate) => {
  if (!releaseDate)
    return { status: "upcoming", text: "Coming Soon", color: "text-blue-400" };

  const now = new Date();
  const release = new Date(releaseDate);

  if (release > now) {
    return { status: "upcoming", text: "Coming Soon", color: "text-blue-400" };
  }

  const daysDiff = (now - release) / (1000 * 60 * 60 * 24);

  if (daysDiff <= 30) {
    return { status: "new", text: "New Release", color: "text-green-400" };
  }

  if (daysDiff <= 365) {
    return { status: "recent", text: "Recent", color: "text-yellow-400" };
  }

  return { status: "classic", text: "Classic", color: "text-gray-400" };
};
