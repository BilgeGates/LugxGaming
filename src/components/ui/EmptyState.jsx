import React from "react";
import { Gamepad2 } from "lucide-react";

export const EmptyState = ({
  icon: Icon = Gamepad2,
  title = "No games found",
  description = "Try adjusting your search criteria",
  action,
}) => (
  <div className="text-center py-16">
    <div className="text-gray-400 mb-4">
      <Icon size={64} />
    </div>
    <h3 className="text-2xl font-bold text-gray-300 mb-2">{title}</h3>
    <p className="text-gray-400 mb-6">{description}</p>
    {action && action}
  </div>
);
