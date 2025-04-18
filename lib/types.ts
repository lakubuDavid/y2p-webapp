import { z } from "zod";
const ValidDaySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
  z.literal(12),
  z.literal(13),
  z.literal(14),
  z.literal(15),
  z.literal(16),
  z.literal(17),
  z.literal(18),
  z.literal(19),
  z.literal(20),
  z.literal(21),
  z.literal(22),
  z.literal(23),
  z.literal(24),
  z.literal(25),
  z.literal(26),
  z.literal(27),
  z.literal(28),
  z.literal(29),
  z.literal(30),
  z.literal(31),
]);

const ValidMonthSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
  z.literal(12),
]);
export const ReservationDateSchema = z
  .object({
    day: ValidDaySchema,
    month: ValidMonthSchema,
    year: z.number().int().positive(),
  })
  .refine(
    (data) => {
      // Validate that the day is valid for the given month and year
      const date = new Date(data.year, data.month - 1, data.day);
      return (
        date.getFullYear() === data.year &&
        date.getMonth() === data.month - 1 &&
        date.getDate() === data.day
      );
    },
    {
      message:
        "Invalid date - the day does not exist for the specified month and year",
      path: ["day"],
    },
  );

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

type TimePeriod = "AM" | "PM" | "";
export type TimeString = `${number}:${number} ${TimePeriod}`;

export const getTimeFromString = (
  time: TimeString,
): { hour: number; minute: number; period: TimePeriod } => {
  // Split the time string by space to separate time and period
  const [timeValue, period = ""] = time.split(" ") as [string, TimePeriod];

  // Split the time value by colon to separate hours and minutes
  const [hourStr, minuteStr] = timeValue.split(":");

  // Convert hour and minute strings to numbers
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  return { hour, minute, period };
};
export type TimeSlot = {
  from: TimeString;
  to: TimeString;
};

export type ReservationSlotType = {
  from: string;
  to: string;
};
export type ReservationSlotsType = ReservationSlotType[];

export type ApiResponse<T, E = Error> = {
  error?: E;
  data?: T;
  status?: string;
  message?: string;
};

export type Reservation = {
  id: number;
  reservationNumber: string;
  petId: number;
  userId: number;
  createdAt: Date; // ISO date string
  date: ReservationDate;
  time: TimeSlot;
  status: "oncoming" | "done" | "canceled" | "reschedueld"; // assuming other statuses may exist
};

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

export type UserData = {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  createdAt: string; // ISO date string
  type: "anonymous" | "staff" | "client"; // guessing another type, update as needed
};

export type StaffUserData = UserData & {
  role: UserRoles;
};

type IdData = {
  id: number;
};

// Optional: full object type if you want to group them together
export type ReservationRecord = {
  reservation: Reservation;
  pet: PetData;
  user: UserData;
};

export type ReservationResponse = {
  data: ReservationRecord[];
};
export type CreateReservationParams = {
  userInfo:
    | {
        name: string;
        surname: string;
        email: string;
        phoneNumber: string;
      }
    | IdData;
  petInfo:
    | {
        name: string;
        specie: string;
      }
    | IdData;
  reservationInfo: {
    date: ReservationDate;
    time: {
      from: string;
      to: string;
    };
  };
};
export type UserTypes = "staff" | "client";
export type UserRoles = "veterinary" | "receptionist" | "admin";
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

const userInfoSchema = z
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

export const CreateReservationSchema = z.object({
  userInfo: userInfoSchema,
  petInfo: z.object({
    name: z.string().min(1, "Pet name is required"),
    specie: z.string().min(1, "Pet specie is required"),
  }),
  reservationInfo: z.object({
    date: ReservationDateSchema,
    time: z.object({
      from: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
      to: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    }),
  }),
});
// Helper function to format the reservation date
export function toDate(date: ReservationDate) {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}
export function toReservationDate(date: Date): ReservationDate {
  return {
    day: (date.getUTCDate() + 1) as ValidDay,
    month: (date.getUTCMonth() + 1) as ValidMonth,
    year: date.getUTCFullYear(),
  };
}

export type ValidDay =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;
export type ValidMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type ReservationDate = {
  day: ValidDay;
  month: ValidMonth;
  year: number;
}; // Define base schemas
