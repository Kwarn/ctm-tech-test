import { z } from "zod";

export const fieldSchema = z.object({
  label: z.string(),
  progressBarLabel: z.string(),
  fieldName: z.string(),
  element: z.string(),
  type: z.string().optional(),
  placeholder: z.string().optional(),
  checkbox: z.string().optional(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  rules: z.record(z.unknown()).optional(),
});

export const sectionSchema = z.object({
  sectionName: z.string(),
  fields: z.array(fieldSchema),
});

export const apiResponseSchema = z.object({
  data: z.object({
    sections: z.array(sectionSchema),
  }),
});
