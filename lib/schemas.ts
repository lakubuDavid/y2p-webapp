import { z } from "zod";

export const UpdatePetSchema = z
  .object({
    name: z.string(),
    metadata: z.record(z.any()),
  })
  .partial();

export type UpdatePetParams = z.infer<typeof UpdatePetSchema>;

export const CreatePetSchema = z.object({
  name: z.string(),
  ownerId: z.number().optional(),
  specie: z.string(),
  metadata: z.record(z.any()),
});

export type CreatePetParams = z.infer<typeof CreatePetSchema>
