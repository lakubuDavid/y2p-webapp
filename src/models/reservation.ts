import {
  type TimeSlot,
  type ValidDay,
  type ValidMonth,
  type IdData,
  ValidDaySchema,
  ValidMonthSchema,
} from "@lib/types";
import { UserInfoSchema, type UserData } from "./user";
import { z } from "zod";
import type { PetData } from "./pet";

export type ReservationSlotType = {
  from: string;
  to: string;
};
export type ReservationSlotsType = ReservationSlotType[];

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

export type Reservation = {
  id: number;
  reservationNumber: string;
  petId: number;
  userId: number;
  assigneeId: number;
  createdAt: Date; // ISO date string
  date: ReservationDate;
  time: TimeSlot;
  status: "oncoming" | "done" | "canceled" | "reschedueld"; // assuming other statuses may exist
};

export interface ReservationHistoryRow {
  date: ReservationDate;
  time: { from: string; to: string };
  status: "oncoming" | "done" | "late" | "rescheduled" | "canceled";
  createdAt: Date | null;
  reservationId: number;
  reservationNumber: string;
}

export type ReservationDate = {
  day: ValidDay;
  month: ValidMonth;
  year: number;
}; // Define base schemas

// Optional: full object type if you want to group them together
export type ReservationRecord = {
  reservation: Reservation;
  pet: PetData;
  user: UserData;
  assignee?: UserData
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
    service:string
  };
};
export const CreateReservationSchema = z.object({
  userInfo: UserInfoSchema,
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
