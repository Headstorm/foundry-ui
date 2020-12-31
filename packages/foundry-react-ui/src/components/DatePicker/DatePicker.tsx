import React, { useState } from 'react';
import styled from 'styled-components';

import { Div } from '../../htmlElements';
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

const HeaderRow = styled(Div)`
  display: flex;
  flex-flow: row nowrap;
`;

const DatesContainer = styled(Div)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DateItem = styled(Div)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 2rem;
  height: 2rem;
`;

const StyledValueContainer = styled(Dropdown.ValueContainer)`
  width: fit-content !important;
`;

const StyledOptionsContainer = styled(Dropdown.OptionsContainer)`
  width: fit-content !important;
`;

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

  const dateNumbers = [];
  for (let i = 1; i <= daysByMonth[monthView]; i++) {
    dateNumbers.push(i);
  }

  // TODO accept styled subcomponents and export them
  return (
    <Card>
      <HeaderRow>
        <Dropdown
          variant={variants.text}
          options={monthOptions}
          values={[monthView]}
          onSelect={months => setMonthView(months[0])}
          StyledValueContainer={StyledValueContainer}
          StyledOptionsContainer={StyledOptionsContainer}
        />
        <Dropdown
          variant={variants.text}
          placeholder={`${yearView}`}
          onSelect={year => setYearView(year)}
          StyledValueContainer={StyledValueContainer}
          StyledOptionsContainer={StyledOptionsContainer}
        />
      </HeaderRow>
      <DatesContainer>
        {dateNumbers.map(num => (
          <DateItem>{num}</DateItem>
        ))}
      </DatesContainer>
    </Card>
  );
};

export default DatePicker;
