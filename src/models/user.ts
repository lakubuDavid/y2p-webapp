import { z } from "zod";

export type UserTypes = "staff" | "client" | "anonymous";
export type UserRoles = "veterinary" | "receptionist" | "admin";

export type User = {
  id: number;
  name: string;
  email: string;
};
export type UserCredentials = {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
};
export type UserData = {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  createdAt: string; // ISO date string
  type: UserTypes; // guessing another type, update as needed
};

export type StaffUserData = UserData & {
  role: UserRoles;
  staffId:number;
};

export const UserInfoSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    phoneNumber: z
      .string()
      .min(7, "Phone number is too short")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one contact method (email or phone number) is required",
        path: ["email"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one contact method (email or phone number) is required",
        path: ["phoneNumber"],
      });
    }
  });
export const CreateUserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    phoneNumber: z
      .string()
      .min(7, "Phone number is too short")
      .optional()
      .or(z.literal("")),
    type: z.enum(["staff", "client"]).default("client"),
    role: z.enum(["veterinary", "admin", "receptionist"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one contact method (email or phone number) is required",
        path: ["email"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one contact method (email or phone number) is required",
        path: ["phoneNumber"],
      });
    }
    if (data.type == "staff") {
      if (!data.role) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Missing role for staff member",
          path: ["role"],
        });
      }
    }
  });
export const AdminCreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(7, "Phone number is too short")
    .optional()
    .or(z.literal("")),
  type: z.enum(["staff", "client"]).default("client"),
  role: z.enum(["veterinary", "admin", "receptionist"]).optional(),
});
export type CreateUserParams = z.infer<typeof CreateUserSchema>;
export type AdminCreateUserParams = z.infer<typeof AdminCreateUserSchema>;
