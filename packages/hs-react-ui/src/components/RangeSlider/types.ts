import { SubcomponentPropsType } from '../commonTypes';

export type ValueProp = {
  value: number;
  label?: string | number | Node;
  color?: string;
};

export type ContainerProps = {
  showDomainLabels?: boolean;
  hasHandleLabels?: boolean;
  disabled: boolean;
  beingDragged: boolean;
};

export type HandleProps = {
  beingDragged?: boolean;
  color: string;
};

export type HandleLabelProps = { velocity?: number };

export type SelectedRangeProps = { min: number; max: number; selectedRange: number[] };

export type DomainLabelProps = { position: 'left' | 'right' };

export type RangeSliderProps = {
  StyledContainer?: any;
  StyledDragHandle?: any;
  StyledHandleLabel?: any;
  StyledSlideRail?: any;
  StyledSelectedRangeRail?: any;
  StyledDomainLabel?: any;
  StyledMarker?: any;
  StyledMarkerLabel?: any;
  containerProps?: SubcomponentPropsType;
  dragHandleProps?: SubcomponentPropsType;
  handleLabelProps?: SubcomponentPropsType;
  slideRailProps?: SubcomponentPropsType;
  selectedRangeRailProps?: SubcomponentPropsType;
  domainLabelProps?: SubcomponentPropsType;
  markerProps?: SubcomponentPropsType;
  markerLabelProps?: SubcomponentPropsType;

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
  values?: number[] | ValueProp[];
  testId?: string;
  markers?: number[] | ValueProp[];
};
