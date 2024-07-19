import { z } from "zod";

export const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  fields: z.array(
    z.object({
      element: z.string(),
      type: z.string(),
      placeholder: z.string().optional(),
      options: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .optional(),
      rules: z.record(z.unknown()).optional(),
    })
  ),
});

export const apiResponseSchema = z.object({
  data: z.object({
    questions: z.object({
      personal: z.array(questionSchema).optional(),
      vehicle: z.array(questionSchema).optional(),
    }),
  }),
});
