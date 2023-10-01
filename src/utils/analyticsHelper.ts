// analyticsHelpers.ts

const monthMapping: { [key: string]: number } = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export function generateDayRanges(userSignupDate: Date): string[] {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setDate(currentDate.getDate() + 1);

  let startDate = new Date(userSignupDate);
  startDate.setHours(0, 0, 0, 0);

  const dayRanges: string[] = [];

  while (startDate <= currentDate) {
    dayRanges.push(startDate.toISOString().split("T")[0]);
    startDate.setDate(startDate.getDate() + 1);
  }

  return dayRanges;
}

export const getStartAndEndDatesForDay = (dayRange: string) => {
  const start = new Date(dayRange);
  const end = new Date(dayRange);
  end.setHours(23, 59, 59, 999); // Set to end of the day

  return { start, end };
};

export function findCurrentDayIndex(dayRanges: string[]): number {
  const currentDateStr = new Date().toISOString().split("T")[0];
  const index = dayRanges.indexOf(currentDateStr);
  return index === -1 ? dayRanges.length - 1 : index;
}

export const generateMonthRanges = (signupDate: Date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const monthRanges: string[] = [];

  // Ensure signupDate is a Date object
  let startDate = new Date(signupDate);
  // Adjust the signupDate to the first of the month
  startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  while (startDate <= currentDate) {
    const startMonth = monthNames[startDate.getMonth()];

    let monthRange = `${startMonth} ${startDate.getFullYear()}`;

    monthRanges.push(monthRange);
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return monthRanges;
};

export const getStartAndEndDatesForMonth = (monthRange: string) => {
  const splitRange = monthRange.split(" ");
  const month = monthMapping[splitRange[0]];
  const year = parseInt(splitRange[1], 10);

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0); // last day of the month

  return { monthStart, monthEnd };
};

export const findCurrentMonthIndex = (monthRanges: any) => {
  const currentMonthStr = new Date().toISOString().slice(0, 7); // gets the 'YYYY-MM' format

  if (Array.isArray(monthRanges)) {
    const index = monthRanges.indexOf(currentMonthStr);
    return index === -1 ? monthRanges.length - 1 : index;
  }

  return -1;
};

export const generateWeekRanges = (signupDate: Date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const weekRanges: string[] = [];

  // Adjust the signupDate to the closest previous Sunday
  let startDate = new Date(signupDate);
  while (startDate.getDay() !== 0) {
    // 0 represents Sunday
    startDate.setDate(startDate.getDate() - 1);
  }
  startDate.setHours(0, 0, 0, 0);

  while (startDate <= currentDate) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const startMonth = monthNames[startDate.getMonth()];
    const endMonth = monthNames[endDate.getMonth()];
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    let weekRange =
      startMonth === endMonth
        ? `${startMonth} ${startDay} - ${endDay}`
        : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

    weekRanges.push(weekRange);
    startDate.setDate(startDate.getDate() + 7);
  }

  return weekRanges;
};

export const getStartAndEndDates = (weekRange: string) => {
  const splitRange = weekRange.split(" - ");

  const startMonthAndDay = splitRange[0].split(" ");
  const endDay = parseInt(splitRange[1], 10);

  const startYear = new Date().getFullYear();
  const startMonth = monthMapping[startMonthAndDay[0]];
  const startDay = parseInt(startMonthAndDay[1], 10);

  let start = new Date(startYear, startMonth, startDay);
  let end = new Date(startYear, startMonth, endDay);

  // Adjusting for year-end crossover
  if (end < start) {
    end.setFullYear(end.getFullYear() + 1);
  }

  return { start, end };
};

export function getWeekStartDate() {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // Sunday - Saturday : 0 - 6
  const numDayFromStartOfWeek = now.getUTCDate() - dayOfWeek;
  const startOfWeek = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    numDayFromStartOfWeek
  );
  return startOfWeek.toISOString().split("T")[0];
}
export const findCurrentWeekIndex = (weekRanges: any) => {
  const currentWeekStartStr = getWeekStartDate();

  if (Array.isArray(weekRanges)) {
    const index = weekRanges.indexOf(currentWeekStartStr);
    return index === -1 ? weekRanges.length - 1 : index;
  }

  return -1;
};
