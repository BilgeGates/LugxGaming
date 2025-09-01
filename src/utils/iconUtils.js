import {
  Map,
  Castle,
  Brain,
  Trophy,
  Target,
  Shield,
  Users,
  Palette,
  Zap,
  Ghost,
  Puzzle,
  Sword,
} from "lucide-react";

import { FaWindows, FaPlaystation, FaXbox, FaMobileAlt } from "react-icons/fa";

import { SiNintendoswitch } from "react-icons/si";

/**
 * Genre icon mapping
 * Return React component or null if not found
 */
export const getGenreIcon = (genreName) => {
  const icons = {
    Action: Sword,
    Adventure: Map,
    RPG: Castle,
    Strategy: Brain,
    Sports: Trophy,
    Racing: Target,
    Shooter: Target,
    Simulation: Brain,
    Puzzle: Puzzle,
    Fighting: Shield,
    Horror: Ghost,
    Platformer: Users,
    Indie: Palette,
    MMORPG: Castle,
    "Battle Royale": Zap,
  };

  return icons[genreName] || null;
};

/**
 * Platform icon mapping
 * Return React component or null if not found
 */
export const getPlatformIcon = (platformName) => {
  const icons = {
    PC: FaWindows,
    PlayStation: FaPlaystation,
    Xbox: FaXbox,
    Nintendo: SiNintendoswitch,
    Mobile: FaMobileAlt,
  };

  return icons[platformName] || null;
};
