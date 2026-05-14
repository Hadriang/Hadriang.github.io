import { Armchair, Headphones, Keyboard, Monitor, Mouse, SquareDashedMousePointer } from "lucide-react";
import type { ComponentType } from "react";
import type { HardwareCategory, HardwareSlot, PlayerRecord } from "../types";

export interface CategoryConfig extends HardwareCategory {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  contextColumns: Array<{
    label: string;
    getValue: (player: PlayerRecord) => string | null | undefined;
  }>;
}

export const categories: CategoryConfig[] = [
  {
    slot: "mouse",
    label: "Mouse",
    route: "mouse",
    icon: Mouse,
    contextColumns: [
      { label: "Team", getValue: (player) => player.team },
      { label: "Role", getValue: (player) => player.role },
      { label: "DPI", getValue: (player) => player.settings.dpi },
      { label: "Hz", getValue: (player) => player.settings.hz },
      { label: "Sens", getValue: (player) => player.settings.sens },
      { label: "eDPI", getValue: (player) => player.settings.edpi }
    ]
  },
  {
    slot: "keyboard",
    label: "Keyboard",
    route: "keyboard",
    icon: Keyboard,
    contextColumns: [
      { label: "Team", getValue: (player) => player.team },
      { label: "Role", getValue: (player) => player.role },
      { label: "Mouse", getValue: (player) => player.gear.mouse?.name }
    ]
  },
  {
    slot: "monitor",
    label: "Monitor",
    route: "monitor",
    icon: Monitor,
    contextColumns: [
      { label: "Team", getValue: (player) => player.team },
      { label: "Resolution", getValue: (player) => player.settings.resolution },
      { label: "Aspect", getValue: (player) => player.settings.aspectRatio },
      { label: "Scaling", getValue: (player) => player.settings.scalingMode }
    ]
  },
  {
    slot: "headset",
    label: "Headset",
    route: "headset",
    icon: Headphones,
    contextColumns: [
      { label: "Team", getValue: (player) => player.team },
      { label: "Role", getValue: (player) => player.role },
      { label: "Keyboard", getValue: (player) => player.gear.keyboard?.name }
    ]
  },
  {
    slot: "mousepad",
    label: "Mousepad",
    route: "mousepad",
    icon: SquareDashedMousePointer,
    contextColumns: [
      { label: "Team", getValue: (player) => player.team },
      { label: "Mouse", getValue: (player) => player.gear.mouse?.name },
      { label: "DPI", getValue: (player) => player.settings.dpi },
      { label: "Sens", getValue: (player) => player.settings.sens }
    ]
  },
  {
    slot: "chair",
    label: "Chair",
    route: "chair",
    icon: Armchair,
    contextColumns: [
      { label: "Team", getValue: (player) => player.team },
      { label: "Role", getValue: (player) => player.role },
      { label: "Mousepad", getValue: (player) => player.gear.mousepad?.name }
    ]
  }
];

export function getCategoryByRoute(route?: string): CategoryConfig {
  return categories.find((category) => category.route === route) ?? categories[0];
}

export function getCategoryBySlot(slot: HardwareSlot): CategoryConfig {
  return categories.find((category) => category.slot === slot) ?? categories[0];
}
