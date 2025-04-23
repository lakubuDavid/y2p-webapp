import { z } from "zod";

export const ValidDaySchema = z.union([
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

export const ValidMonthSchema = z.union([
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


export type ApiResponse<T, E = Error> = {
  error?: E;
  data?: T;
  status?: string;
  message?: string;
};



export type IdData = {
  id: number;
};

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
