import React, { useState } from 'react';

import variants from '../../enums/variants';
import Dropdown, { objectOrArrayToDropdownOptions } from '../Dropdown';
import Card from '../Card';

const weekends = [0, 6];
const weekdays = [1, 2, 3, 4, 5];
const daysByMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const daysByMonthOnLeapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const shortDayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const longDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const shortMonthNames = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];
const longMonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const monthOptions = objectOrArrayToDropdownOptions(longMonthNames);
const today = new Date();

export const isLeapYear = (date: Date): boolean => {
  const year = date.getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export type DatePickerProps = {
  selectedDate?: Date; // the currently selected date
  onSelect?: () => void; // onClick of a date in the valid date range
  initialMonthView?: number; // which month view is open on mount (default is the current month)
  initialYearView?: number; // which year view is open on mount (default is the current year)
};

// TODO: Render the current month/year as dropdowns
// TODO: Render a month of days in a grid with blanks

const DatePicker = ({
  initialMonthView = today.getMonth(),
  initialYearView = today.getFullYear(),
}: DatePickerProps): JSX.Element | null => {
  const [monthView, setMonthView] = useState(`${initialMonthView}`);
  const [yearView, setYearView] = useState(initialYearView);

  return (
    <Card>
      <Dropdown
        variant={variants.text}
        options={monthOptions}
        values={[monthView]}
        onSelect={months => setMonthView(months[0])}
      />
      <Dropdown
        variant={variants.text}
        placeholder={`${yearView}`}
        onSelect={year => setYearView(year)}
      />
    </Card>
  );
};

export default DatePicker;
