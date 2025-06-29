import { z } from "zod";

export const FullNameSchema = z.object({
  id: z.string().optional(),
  en: z.string().optional(),
});

export const OrgNameSchema = z.object({
  id: z.string().optional(),
  en: z.string().optional(),
});

export const LaureateSchema = z.object({
  fullName: FullNameSchema.optional(),
  orgName: OrgNameSchema.optional(),
});

export const NobelSchema = z.object({
  awardYear: z.number().optional(),
  dateAwarded: z.string().optional(),
  category: z
    .object({
      en: z.string().optional(),
    })
    .optional(),
  laureates: z.array(LaureateSchema).optional(),
});

export type NobelInput = z.infer<typeof NobelSchema>;
