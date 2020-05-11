import { StyledComponentBase } from 'styled-components';

export type valueProp = {
  value: number,
  label?: String | number | Node,
  color?: String
};

export type containerProps = { showDomainLabels?: boolean, hasHandleLabels?: boolean, disabled: boolean };

export type handleProps = {
  beingDragged?: boolean,
  color: String
};

export type handleLabelProps = {velocity?: number};

export type selectedRangeProps = { min: number, max: number, values: object[], selectedRange: number[] };

export type domainLabelProps = { position: "left" | "right" };

export type RangeSliderProps = {
  StyledContainer?: String & StyledComponentBase<any, {}>,
  StyledDragHandle?: String & StyledComponentBase<any, {}>,
  StyledHandleLabel?: String & StyledComponentBase<any, {}>,
  StyledSlideRail?: String & StyledComponentBase<any, {}>,
  StyledSelectedRangeRail?: String & StyledComponentBase<any, {}>,
  StyledDomainLabel?: String & StyledComponentBase<any, {}>,

  showDomainLabels?: boolean,
  showSelectedRange?: boolean,

  debounceInterval?: number,
  axisLock?: 'x' | 'y',
  onDrag?: Function,
  disabled?: boolean
  min: number,
  max: number,
  values?: number[] | valueProp[],
  markers?: number[] | valueProp[],
};