import {
  Gamepad2,
  Sword,
  Map,
  Castle,
  Brain,
  Car,
  Globe2,
  Puzzle,
  Ghost,
  Users,
  Palette,
  Trophy,
  Zap,
  Shield,
  Target,
} from "lucide-react";

import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaInnosoft,
  FaMobileAlt,
} from "react-icons/fa";

/**
 * Icon mapping utilities
 */

export const getGenreIcon = (genreName) => {
  const icons = {
    Action: Sword,
    Adventure: Map,
    RPG: Castle,
    Strategy: Brain,
    Sports: Trophy,
    Racing: Car,
    Shooter: Target,
    Simulation: Globe2,
    Puzzle: Puzzle,
    Fighting: Shield,
    Horror: Ghost,
    Platformer: Users,
    Indie: Palette,
    MMORPG: Castle,
    "Battle Royale": Zap,
  };

  return icons[genreName] || Gamepad2;
};

export const getPlatformIcon = (platformName) => {
  const icons = {
    PC: FaWindows,
    PlayStation: FaPlaystation,
    Xbox: FaXbox,
    Nintendo: FaInnosoft,
    Mobile: FaMobileAlt,
  };
  return icons[platformName] || Gamepad2;
};
