import React from 'react';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';

export type ValueProp = {
  value: number;
  label?: string | number | Node;
  color?: string;
};

export type ContainerProps = {
  showDomainLabels?: boolean;
  showHandleLabels?: boolean;
  hasHandleLabels?: boolean;
  disabled: boolean;
  beingDragged: boolean;
};

export type HandleProps = {
  beingDragged?: boolean;
  color: string;
};

export type HandleLabelProps = { velocity?: number; showHandleLabels?: boolean };

export type SelectedRangeProps = {
  min: number;
  max: number;
  selectedRange: number[];
  animateRangeRail: boolean;
};

export type DomainLabelProps = { position: 'left' | 'right' };

export type RangeSliderProps = {
  StyledContainer?: StyledSubcomponentType;
  StyledDragHandle?: StyledSubcomponentType;
  StyledHandleLabel?: StyledSubcomponentType;
  StyledSlideRail?: any;
  StyledSelectedRangeRail?: StyledSubcomponentType;
  StyledDomainLabel?: StyledSubcomponentType;
  StyledMarker?: StyledSubcomponentType;
  StyledMarkerLabel?: StyledSubcomponentType;
  containerProps?: SubcomponentPropsType;
  dragHandleProps?: SubcomponentPropsType;
  handleLabelProps?: SubcomponentPropsType;
  slideRailProps?: SubcomponentPropsType;
  selectedRangeRailProps?: SubcomponentPropsType;
  domainLabelProps?: SubcomponentPropsType;
  markerProps?: SubcomponentPropsType;
  markerLabelProps?: SubcomponentPropsType;

  containerRef?: React.RefObject<HTMLDivElement>;
  dragHandleRef?: React.RefObject<HTMLDivElement>;
  handleLabelRef?: React.RefObject<HTMLDivElement>;
  slideRailRef?: React.RefObject<HTMLDivElement>;
  selectedRangeRailRef?: React.RefObject<HTMLDivElement>;
  domainLabelRef?: React.RefObject<HTMLDivElement>;
  markerRef?: React.RefObject<HTMLDivElement>;
  markerLabelRef?: React.RefObject<HTMLDivElement>;

  showDomainLabels?: boolean;
  showSelectedRange?: boolean;
  showHandleLabels?: boolean;

  motionBlur?: boolean;
  springOnRelease?: boolean;
  /** Debounce interval (in ms) before calling `onDebounceChange`. */
  debounceInterval?: number;
  axisLock?: 'x' | 'y' | '';
  /** @deprecated use onChange or onDebounceChange instead. */
  onDrag?: (val: number) => void;
  /** Called immediately as value slider's selection, regardless of `debounceInterval`. */
  onChange?: (val: number) => void;
  /** Called after `debounceInterval` as slider's selection changes. */
  onDebounceChange?: (val: number) => void;
  disabled?: boolean;
  min: number;
  max: number;
  values?: number[] | ValueProp[];
  testId?: string;
  markers?: number[] | ValueProp[];
};
