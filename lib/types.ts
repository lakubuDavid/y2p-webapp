import {z} from "zod"
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

export type ApiResponse<T> = {
  error?: Error;
  data: T;
  status?:string;
  message?:string
};

export type Reservation = {
  id: number;
  petId: number;
  userId: number;
  createdAt: Date; // ISO date string
  date: Date; // ISO date string
  status: "oncoming" | "done" | "canceled" | "reschedueld"; // assuming other statuses may exist
};

export type PetData = {
  id: number;
  name: string;
  owner: number; // userId of the owner
  specie: string; // could be refined to a union type if species are predefined
  createdAt: string; // ISO date string
};

export type PetInfo = {
  pet:PetData,
  owner:Omit<UserData,"type" | "id">
}

export type UserData = {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  createdAt: string; // ISO date string
  type: "anonymous" | "staff" | "client"; // guessing another type, update as needed
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
  userInfo: {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
  };
  petInfo: {
    name: string;
    specie: string;
  };
  reservationInfo: {
    date: Date;
    time: {
      from: string;
      to: string;
    };
  };
};

const userInfoSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    surname: z.string().min(1, 'Surname is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phoneNumber: z
      .string()
      .min(7, 'Phone number is too short')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one contact method (email or phone number) is required',
        path: ['email'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one contact method (email or phone number) is required',
        path: ['phoneNumber'],
      });
    }
  });

export const CreateReservationSchema = z.object({
  userInfo: userInfoSchema,
  petInfo: z.object({
    name: z.string().min(1, 'Pet name is required'),
    specie: z.string().min(1, 'Pet specie is required'),
  }),
  reservationInfo: z.object({
    date: z.date({
      required_error: 'Date is required',
      invalid_type_error: 'Invalid date',
    }),
    time: z.object({
      from: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
      to: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
    }),
  }),
});
