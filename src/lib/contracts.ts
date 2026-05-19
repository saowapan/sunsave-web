import { z } from 'zod';

/**
 * SHARED API CONTRACTS
 *
 * These types and schemas must stay in sync with the backend's
 * `src/calculations/domain/types.ts`. In a longer project these would
 * live in a shared workspace package; for this timeline they're duplicated
 * with a synchronisation note.
 */

export const PROPERTY_TYPES = [
  'DETACHED',
  'SEMI_DETACHED',
  'MID_TERRACE',
  'END_TERRACE',
  'FLAT',
  'BUNGALOW',
] as const;

export const REGIONS = [
  'LONDON',
  'SOUTH_EAST',
  'SOUTH_WEST',
  'MIDLANDS',
  'NORTH',
  'SCOTLAND',
  'WALES',
  'NORTHERN_IRELAND',
] as const;

export const ORIENTATIONS = [
  'SOUTH',
  'SOUTH_EAST',
  'SOUTH_WEST',
  'EAST',
  'WEST',
  'NORTH',
] as const;

export const PropertyTypeSchema = z.enum(PROPERTY_TYPES);
export const RegionSchema = z.enum(REGIONS);
export const OrientationSchema = z.enum(ORIENTATIONS);

export type PropertyType = z.infer<typeof PropertyTypeSchema>;
export type Region = z.infer<typeof RegionSchema>;
export type Orientation = z.infer<typeof OrientationSchema>;

export const QuoteInputsSchema = z.object({
  propertyType: PropertyTypeSchema,
  region: RegionSchema,
  roofOrientation: OrientationSchema,
  monthlyBillGbp: z.number().positive().min(10).max(2000),
});

export type QuoteInputs = z.infer<typeof QuoteInputsSchema>;

export interface QuoteResponse {
  id: string;
  createdAt: string;
  propertyType: PropertyType;
  region: Region;
  roofOrientation: Orientation;
  monthlyBillGbp: number;
  systemSizeKw: number;
  annualGenerationKwh: number;
  annualSavingsGbp: number;
  monthlySubscriptionGbp: number;
  upfrontPriceGbp: number;
  paybackYears: number;
  annualCo2SavedKg: number;
}

/**
 * Human-readable labels for enum values. UI uses these for display;
 * the API only knows the codes.
 */
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  DETACHED: 'Detached',
  SEMI_DETACHED: 'Semi-detached',
  MID_TERRACE: 'Mid-terrace',
  END_TERRACE: 'End-terrace',
  FLAT: 'Flat',
  BUNGALOW: 'Bungalow',
};

export const REGION_LABELS: Record<Region, string> = {
  LONDON: 'London',
  SOUTH_EAST: 'South East',
  SOUTH_WEST: 'South West',
  MIDLANDS: 'Midlands',
  NORTH: 'North',
  SCOTLAND: 'Scotland',
  WALES: 'Wales',
  NORTHERN_IRELAND: 'Northern Ireland',
};

export const ORIENTATION_LABELS: Record<Orientation, string> = {
  SOUTH: 'South',
  SOUTH_EAST: 'South-east',
  SOUTH_WEST: 'South-west',
  EAST: 'East',
  WEST: 'West',
  NORTH: 'North',
};