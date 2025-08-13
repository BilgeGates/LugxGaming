import React from "react";
import {
  Gamepad2,
  Monitor,
  Smartphone,
  Gamepad2 as NintendoIcon,
} from "lucide-react";

export const PlatformBadge = ({ platforms, maxShow = 3 }) => {
  if (!platforms || platforms.length === 0) return null;

  const getPlatformIcon = (platformName) => {
    const name = platformName?.toLowerCase() || "";
    if (name.includes("playstation")) return Gamepad2;
    if (name.includes("xbox")) return Gamepad2;
    if (name.includes("pc") || name.includes("windows")) return Monitor;
    if (name.includes("nintendo") || name.includes("switch"))
      return NintendoIcon;
    if (name.includes("ios") || name.includes("android")) return Smartphone;
    return Gamepad2;
  };

  const visiblePlatforms = platforms.slice(0, maxShow);
  const remainingCount = platforms.length - maxShow;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visiblePlatforms.map((platform, index) => {
        const Icon = getPlatformIcon(platform.platform?.name);
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-gray-600/50 text-gray-200 text-xs px-2 py-1 rounded-full backdrop-blur-sm"
            title={platform.platform?.name}
          >
            <Icon size={12} />
            <span className="max-w-16 truncate">
              {platform.platform?.name || "Unknown"}
            </span>
          </span>
        );
      })}

      {remainingCount > 0 && (
        <span className="inline-flex items-center bg-gray-600/50 text-gray-200 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};
