import type { UserData } from "./user";

export type PetData = {
  id: number;
  name: string;
  ownerId: number; // userId of the owner
  specie: string; // could be refined to a union type if species are predefined
  createdAt: string; // ISO date string
  metadata: Record<string, any>;
};

export type PetInfo = {
  pet: PetData;
  owner: Omit<UserData, "type" | "id">;
};

export type PetRecord = {
  
  id: number;
  name: string;
  owner: Omit<UserData, "type" | "id">;
  ownerId: number; // userId of the owner
  specie: string; // could be refined to a union type if species are predefined
  createdAt: string; // ISO date string
  metadata: Record<string, any>;
}
