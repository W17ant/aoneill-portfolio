/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   EXPERIMENT ICON - Maps icon names to Lucide SVGs   ###
   ###   Last Updated: 27-12-2024                           ###
   ########################################################### */

import { IdCard, Terminal, Magnet, FileText, type LucideIcon } from 'lucide-react';

/* ###########################################################
   ###   1. Icon Mapping                                    ###
   ########################################################### */

const iconMap: Record<string, LucideIcon> = {
  IdCard,
  Terminal,
  Magnet,
  FileText,
};

/* ###########################################################
   ###   2. Component                                       ###
   ########################################################### */

interface ExperimentIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function ExperimentIcon({ name, size = 20, className = '' }: ExperimentIconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return <span className={className}>{name}</span>;
  }

  return <IconComponent size={size} className={className} />;
}

/* ###########################################################
   ###           END OF EXPERIMENT ICON                     ###
   ########################################################### */
