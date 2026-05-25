import { ReactNode } from "react";

export interface FeatureCardProps {
  icon: ReactNode;
  label: string;
  
  onClick?: () => void;
  className?: string;
  hoverColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  iconSize?: string;
  textSize?: string;
  padding?: string;
  gap?: string;
  showGlowEffect?: boolean;
  animationDuration?: string;
}

export interface Feature {
  id: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export interface GridColumns {
  mobile?: number;
  sm?: number;
  lg?: number;
  xl?: number;
}

export interface FeaturesGridProps {
  features: Feature[];
  columns?: GridColumns;
  gap?: string;
  maxWidth?: string;
  cardProps?: Partial<FeatureCardProps>;
  className?: string;
}

export type HeaderAlign = "left" | "center" | "right";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: HeaderAlign;
  titleSize?: string;
  subtitleSize?: string;
  titleColor?: string;
  subtitleColor?: string;
  titleWeight?: string;
  subtitleWeight?: string;
  spacing?: string;
  marginBottom?: string;
  maxWidth?: string;
  className?: string;
  children?: ReactNode;
}

export interface FeaturesSectionProps {
  title: string;
  subtitle?: string;
  headerProps?: Partial<SectionHeaderProps>;
  features: Feature[];
  gridProps?: Partial<FeaturesGridProps>;
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundGradient?: string;
  padding?: string;
  maxWidth?: string;
  containerClassName?: string;
  sectionClassName?: string;
}

export interface NavigableFeature extends Feature {
  onClick: () => void;
}

export interface StyledFeature extends Feature {
  cardProps?: Partial<FeatureCardProps>;
}

export interface ThemedFeaturesConfig {
  theme: {
    primary: string;
    hover: string;
    border: string;
    background: string;
  };
  
  features: Feature[];
  
  layout: {
    columns: GridColumns;
    gap: string;
    padding: string;
  };
}


export const FeatureCardPresets = {
  compact: {
    padding: "p-3",
    gap: "gap-2",
    iconSize: "w-4 h-4",
    textSize: "text-xs",
  } as Partial<FeatureCardProps>,
  
  standard: {
    padding: "p-5 sm:p-6",
    gap: "gap-4 sm:gap-5",
    iconSize: "w-7 h-7",
    textSize: "text-sm sm:text-base",
  } as Partial<FeatureCardProps>,
  
  large: {
    padding: "p-10",
    gap: "gap-8",
    iconSize: "w-12 h-12",
    textSize: "text-2xl",
  } as Partial<FeatureCardProps>,
};

export const GridLayoutPresets = {
  dense: {
    columns: { mobile: 2, sm: 3, lg: 4, xl: 5 },
    gap: "gap-2",
  } as Partial<FeaturesGridProps>,
  
  standard: {
    columns: { mobile: 1, sm: 2, lg: 3, xl: 4 },
    gap: "gap-2",
  } as Partial<FeaturesGridProps>,
  
  showcase: {
    columns: { mobile: 1, sm: 1, lg: 3, xl: 3 },
    gap: "gap-8",
  } as Partial<FeaturesGridProps>,
};

// ============================================================================
// EXAMPLES
// ============================================================================

/**
 * Example: Basic feature
 * 
 * const feature: Feature = {
 *   id: "fast",
 *   icon: <Zap />,
 *   label: "Lightning Fast"
 * };
 */

/**
 * Example: Navigable feature
 * 
 * const navFeature: NavigableFeature = {
 *   id: "dashboard",
 *   icon: <LayoutDashboard />,
 *   label: "Dashboard",
 *   onClick: () => router.push("/dashboard")
 * };
 */

/**
 * Example: Using presets
 * 
 * <FeatureCard
 *   {...FeatureCardPresets.large}
 *   icon={<Star />}
 *   label="Featured"
 * />
 */

export {};
