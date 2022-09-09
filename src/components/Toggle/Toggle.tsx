import React, { RefObject } from 'react';
import styled from 'styled-components';

import { setLightness, mix, transparentize, readableColor } from 'polished';
import { useSwitch } from 'react-aria';
import { useToggleState } from '@react-stately/toggle';
import { useSpring } from '@react-spring/web';
import useMeasure from 'react-use-measure';
import { ResizeObserver } from '@juggle/resize-observer';

import { AnimatedDiv, StyledBaseInput, StyledBaseLabel } from '../../htmlElements';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { useAnalytics, useTheme } from '../../context';
import variants from '../../enums/variants';
import { disabledStyles } from '../../utils/color';
import { mergeRefs } from '../../utils/refs';

// Hide toggle visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
export const Input = styled(StyledBaseInput).attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const Handle = styled(AnimatedDiv)`
  ${({ variant, color }) => `
      ${
        variant === variants.outline || variant === variants.text
          ? `border: 1px solid ${color};
          margin-left: -1px;`
          : ''
      }
      ${
        variant === variants.fill || variant === variants.text
          ? `
              background-color: ${color};
          `
          : ''
      }
      ${
        variant === variants.fill
          ? `
        box-shadow: 0 .125em .125em -.125em ${transparentize(0.3, setLightness(0.2, color))}; 
      `
          : ''
      }

      position: absolute;
      top: 50%;
      left 0;
      transform: translateY(-50%) translateX(0px - calc(.25em / 2));

      border-radius: .5em;
      width: calc(1em - (.25em));
      height: calc(1em - (.25em));
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
      margin-right: 0.5em;
  `}}
`;

export const Container = styled(StyledBaseLabel)`
  ${({
    color,
    variant,
    focusRingColor,
    disabled,
  }: {
    color: string;
    variant: variants;
    focusRingColor: string;
    disabled: boolean;
  }) => `
      ${
        variant === variants.outline || variant === variants.text
          ? `border: 1px solid ${color};`
          : ''
      }
      ${
        variant === variants.fill
          ? `
        background-color: ${mix(0.4, color, readableColor(color))};
        box-shadow: 0 .125em .25em -.125em ${transparentize(0.3, setLightness(0.2, color))} inset; 
      `
          : ''
      }
      &:hover {
        background-color: ${mix(0.3, color, readableColor(color))}
      }
      transition: background-color .2s;
      overflow: hidden;

      position: relative;
      cursor: pointer;
      border-radius: .75em;
      width: 2em;
      height: 1em;
      display: inline-block;
      vertical-align: top;

      &:focus-within {
        ${Handle} {
          box-shadow: 0 0 5px 0.150rem ${focusRingColor};
        }
      }

      ${disabled ? disabledStyles() : ''}
    `}
`;

const Toggle = ({
  color,
  StyledContainer = Container,
  StyledHandle = Handle,
  StyledInput = Input,

  containerProps = {},
  handleProps = {},
  inputProps = {},

  variant = variants.fill,
  checked = false,
  disabled = false,
  onToggle,
  containerRef,
  handleRef,
  inputRef,
}: {
  color?: string;

  StyledContainer?: StyledSubcomponentType;
  StyledHandle?: StyledSubcomponentType;
  StyledInput?: StyledSubcomponentType;
  StyledIcon?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;
  handleProps?: SubcomponentPropsType;
  inputProps?: SubcomponentPropsType;
  iconProps?: SubcomponentPropsType;

  variant?: variants;
  checked?: boolean;
  disabled?: boolean;
  onToggle?: (event: React.MouseEvent) => void;

  containerRef?: React.RefObject<HTMLLabelElement>;
  handleRef?: React.RefObject<HTMLDivElement>;
  inputRef?: React.RefObject<HTMLInputElement>;
}): JSX.Element => {
  const { colors } = useTheme();

  const [measurableContainerRef, containerBounds] = useMeasure({ polyfill: ResizeObserver });
  const [measurableHandleRef, handleBounds] = useMeasure({ polyfill: ResizeObserver });

  const mergedInputProps = {
    isDisabled: disabled,
    isSelected: checked,
    'aria-label': 'toggle',
    ...inputProps,
  };

  const state = useToggleState(mergedInputProps);

  const gutterWidth = (containerBounds.height - handleBounds.height) / 2;

  const { transform } = useSpring({
    transform: checked
      ? `translateY(-50%) translateX(${containerBounds.width - handleBounds.width - gutterWidth}px)`
      : `translateY(-50%) translateX(${gutterWidth}px)`,
    config: { tension: 250, friction: 20 },
  });

  const internalRef = React.useRef<HTMLInputElement>();
  const { inputProps: ariaProps } = useSwitch(
    mergedInputProps,
    state,
    internalRef as RefObject<HTMLInputElement>,
  );
  const handleEventWithAnalytics = useAnalytics();
  const handleToggle = (e: any) =>
    handleEventWithAnalytics('Toggle', onToggle, 'onToggle', e, containerProps);

  return (
    <StyledContainer
      color={color || colors.background}
      ref={mergeRefs([containerRef, measurableContainerRef])}
      variant={variant}
      focusRingColor={colors.tertiary}
      disabled={disabled}
      {...containerProps}
    >
      <StyledHandle
        color={color || colors.background}
        style={{ transform }}
        ref={mergeRefs([handleRef, measurableHandleRef])}
        checked={checked}
        variant={variant}
        {...handleProps}
      />
      <StyledInput
        role="switch"
        {...ariaProps}
        checked={checked}
        onClick={handleToggle}
        ref={mergeRefs([inputRef, internalRef])}
        {...inputProps}
      />
    </StyledContainer>
  );
};

Toggle.Handle = Handle;
Toggle.Input = Input;
Toggle.Container = Container;

export default Toggle;
