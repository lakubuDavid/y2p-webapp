export const capitalized = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);
// export const today = ()=>{
//   return new Date(new Date().setUTCHours(0,0,0))
// }
export const sameDay = (a: Date, b: Date): boolean => {
  const normalize = (date: Date) => {
    return Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    );
  };

  return normalize(a) === normalize(b);
};

export const normalizeDate = (date: Date) => {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};
export const normalizedDate = (date: Date) => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  ).setUTCHours(0,0,0);
};
export const today = () => {
  return normalizedDate(new Date());
};
