import { Day, DayProps } from "./Day";
import { ComponentType } from "react";
import { Year, YearProps } from "./Year";
import { WeekDays, WeekDaysProps } from "./WeekDays";

export type Components = {
  Day: ComponentType<DayProps>;
  Year: ComponentType<YearProps>;
  WeekDays: ComponentType<WeekDaysProps>;
};

export const defaultComponents: Components = {
  Day,
  Year,
  WeekDays,
};
