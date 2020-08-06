import { SubcomponentPropsType } from '../commonTypes';

export type valueProp = {
  value: number;
  label?: string | number | Node;
  color?: string;
};

export type containerProps = {
  showDomainLabels?: boolean;
  hasHandleLabels?: boolean;
  disabled: boolean;
  beingDragged: boolean;
};

export type handleProps = {
  beingDragged?: boolean;
  color: string;
};

export type handleLabelProps = { velocity?: number };

export type selectedRangeProps = { min: number; max: number; selectedRange: number[] };

export type domainLabelProps = { position: 'left' | 'right' };

export type RangeSliderProps = {
  StyledContainer?: any;
  StyledDragHandle?: any;
  StyledHandleLabel?: any;
  StyledSlideRail?: any;
  StyledSelectedRangeRail?: any;
  StyledDomainLabel?: any;
  containerProps?: SubcomponentPropsType;
  dragHandleProps?: SubcomponentPropsType;
  handleLabelProps?: SubcomponentPropsType;
  slideRailProps?: SubcomponentPropsType;
  selectedRangeRailProps?: SubcomponentPropsType;
  domainLabelProps?: SubcomponentPropsType;

  showDomainLabels?: boolean;
  showSelectedRange?: boolean;

  motionBlur?: boolean;
  springOnRelease?: boolean;
  debounceInterval?: number;
  axisLock?: 'x' | 'y' | '';
  onDrag?: (val: number) => void;
  disabled?: boolean;
  min: number;
  max: number;
  values?: number[] | valueProp[];
  testId?: string;
};
