import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
}

export function urgencyLabel(urgency: string): string {
  const map: Record<string, string> = {
    LOW: 'Faible', MEDIUM: 'Modérée', HIGH: 'Urgente', CRITICAL: 'Critique',
  };
  return map[urgency] ?? urgency;
}

export function urgencyColor(urgency: string): string {
  const map: Record<string, string> = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  };
  return map[urgency] ?? 'bg-gray-100 text-gray-800';
}

export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    FOOD: 'Alimentation', CLOTHING: 'Vêtements', SCHOOL_SUPPLIES: 'Fournitures scolaires',
    MEDICAL: 'Médical', HOUSING: 'Logement', OTHER: 'Autre',
  };
  return map[cat] ?? cat;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}
