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
  readonly: boolean;
};

export type HandleProps = {
  $beingDragged?: boolean;
  color: string;
  readonly: boolean;
};

export type HandleLabelProps = { velocity?: number; showHandleLabels?: boolean };

export type SelectedRangeProps = {
  min: number;
  max: number;
  selectedRangeValues: number[];
  behavior: 'followHandle' | 'followValue';
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

  springOnRelease?: boolean;
  /** Debounce interval (in ms) before calling `onDebounceChange`. */
  debounceInterval?: number;

  /** Called immediately as slider's selection changes. */
  onChange?: (val: number) => void;
  /** Called `debounceInterval` ms after the most recent change of selection. */
  onDebounceChange?: (val: number) => void;
  /** Called when the slider's drag gesture is released */
  onRelease?: (val: number) => void;

  disabled?: boolean;
  readonly?: boolean;
  min: number;
  max: number;
  values: number[] | ValueProp[];
  testId?: string;
  markers?: number[] | ValueProp[];
  /**
   * If true, the drag handle will snap to the passed-in `value`.
   * If false, the drag handle will directly follow the mouse on drag.
   */
  dragHandleBehavior?: 'snapToValue' | 'followMouse';

  /** @deprecated use onChange or onChangeDebounce instead. */
  onDrag?: (val: number) => void;
  /** @deprecated do not use. */
  motionBlur?: boolean;
  /** @deprecated do not use. */
  axisLock?: 'x' | 'y' | '';
};
