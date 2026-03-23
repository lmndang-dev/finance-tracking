import {
  Utensils, ShoppingCart, Beef, Hamburger, Coffee, Bike,
  Car, Fuel, Wrench, Bus, CarTaxiFront, Milestone,
  ShoppingBag, Shirt, Laptop, Sofa, Watch,
  House, KeyRound, Zap, Droplets, Wifi, Phone, Shield,
  HeartPulse, Stethoscope, Pill, Dumbbell, Smile,
  Tv, PlayCircle, Clapperboard, Gamepad2, Palette,
  BookOpen, GraduationCap, Book, MonitorPlay,
  Plane, BedDouble, Map,
  Sparkles, Scissors, Droplet, Flower2,
  CircleEllipsis,
  Briefcase, Building2, Clock, Star,
  Store, Tag, Handshake,
  TrendingUp, TrendingDown, BarChart2, Percent, Bitcoin, Landmark,
  Gift, ArrowLeftRight,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  // Food & Beverage
  "utensils":       Utensils,
  "shopping-cart":  ShoppingCart,
  "beef":           Beef,
  "hamburger":      Hamburger,
  "coffee":         Coffee,
  "bike":           Bike,
  // Transportation
  "car":            Car,
  "fuel":           Fuel,
  "wrench":         Wrench,
  "bus":            Bus,
  "car-taxi-front": CarTaxiFront,
  "milestone":      Milestone,
  // Shopping
  "shopping-bag":   ShoppingBag,
  "shirt":          Shirt,
  "laptop":         Laptop,
  "sofa":           Sofa,
  "watch":          Watch,
  // Housing & Bills
  "house":          House,
  "key-round":      KeyRound,
  "zap":            Zap,
  "droplets":       Droplets,
  "wifi":           Wifi,
  "phone":          Phone,
  "shield":         Shield,
  // Health
  "heart-pulse":    HeartPulse,
  "stethoscope":    Stethoscope,
  "pill":           Pill,
  "dumbbell":       Dumbbell,
  "smile":          Smile,
  // Entertainment
  "tv":             Tv,
  "play-circle":    PlayCircle,
  "clapperboard":   Clapperboard,
  "gamepad-2":      Gamepad2,
  "palette":        Palette,
  // Education
  "book-open":      BookOpen,
  "graduation-cap": GraduationCap,
  "book":           Book,
  "monitor-play":   MonitorPlay,
  // Travel
  "plane":          Plane,
  "bed-double":     BedDouble,
  "map":            Map,
  // Personal Care
  "sparkles":       Sparkles,
  "scissors":       Scissors,
  "droplet":        Droplet,
  "flower-2":       Flower2,
  // Others
  "circle-ellipsis": CircleEllipsis,
  // Income — Salary
  "briefcase":      Briefcase,
  "building-2":     Building2,
  "clock":          Clock,
  "star":           Star,
  // Income — Business
  "store":          Store,
  "tag":            Tag,
  "handshake":      Handshake,
  // Income — Investment
  "trending-up":    TrendingUp,
  "trending-down":  TrendingDown,
  "bar-chart-2":    BarChart2,
  "percent":        Percent,
  "bitcoin":        Bitcoin,
  "landmark":       Landmark,
  // Income — Gift & Transfer
  "gift":           Gift,
  "arrow-left-right": ArrowLeftRight,
  // Sidebar
  "layout-dashboard": LayoutDashboard,
};

export function getIcon(name: string): LucideIcon | null {
  return ICON_MAP[name] ?? null;
}
