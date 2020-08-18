import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styled, { css, StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose, mdiMenuDown, mdiMenuUp } from '@mdi/js';
import { shade, tint, getLuminance, darken } from 'polished';

import { useTheme } from '../../context';
import Button from '../Button/Button';
import variants from '../../enums/variants';
import timings from '../../enums/timings';
import { Div, Span } from '../../htmlElements';
import Text from '../Text/Text';
import { getFontColorFromVariant, getBackgroundColorFromVariant } from '../../utils/color';
import { SubcomponentPropsType } from '../commonTypes';
import { getShadowStyle } from '../../utils/styles';

export type OptionProps = {
  id: number | string;
  optionValue: ReactNode;
  isSelected?: boolean;
};

type UsefulDropdownState = {
  color: string;
  multi?: boolean;
  selected?: boolean;
  variant: variants;
};

const Container = styled(Div)`
  ${({ elevation, isOpen }) => {
    const { colors } = useTheme();
    return `
      width: fit-content;
      transition: filter ${timings.slow}, box-shadow ${timings.slow};
      ${getShadowStyle(elevation, colors.shadow)}
      position: relative;
      z-index: ${isOpen ? '7' : '1'};
    `;
  }}
`;
// TODO - Add constants for width
export const ValueContainer = styled(Button.Container)`
  ${({ modalIsOpen }) => `
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;

    ${
      modalIsOpen
        ? `
          border-bottom: 0px solid transparent;
          border-bottom-right-radius: 0rem;
          border-bottom-left-radius: 0rem;
        `
        : ''
    }

    width: 15rem;
    padding: .5rem 1rem;
  `}
`;

const ValueIconContainer = styled(Div)`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  width: 3rem;
`;

// TODO: Don't use explicit height here - this div is ending up larger than the icon otherwise
const CloseIconContainer = styled(Div)`
  height: 1.125rem;
`;

const ValueItem = styled(Div)`
  width: 100%;
  text-align: left;
`;

const OptionsContainer = styled(Div)`
  ${({ color, variant }: UsefulDropdownState) => `
    background: white;
    position: absolute;
    top: 100%;
    left: 0px;
    max-height: 10rem;
    overflow-y: scroll;
    width: 15rem;
    ${
      variant !== variants.text
        ? `
            border: 1px solid ${color};
          `
        : ''
    }
    border-top: 0px solid transparent;
    border-radius: 0rem 0rem 0.25rem 0.25rem;
    z-index: 1000;
  `}
`;

const OptionItem = styled(Div)`
  ${({ selected, color, variant }: UsefulDropdownState) => {
    const unselectedBgColor = getBackgroundColorFromVariant(variant, color);
    const selectedBgColor = getLuminance(color) > 0.5 ? shade(0.125, color) : tint(0.5, color);
    const backgroundColor = selected ? selectedBgColor : unselectedBgColor;

    return `
      padding: 0.5rem;
      display: flex;
      align-items: center;
      color: ${getFontColorFromVariant(variant, color)};
      background-color: ${backgroundColor};
  
      &:hover {
        background-color: ${
          backgroundColor !== 'transparent' ? darken(0.05, backgroundColor) : 'rgba(0, 0, 0, 0.05)'
        };
    
        cursor: pointer;
        outline: none;
      }
      &:focus {
        outline: none;
        background-color: ${
          backgroundColor !== 'transparent' ? darken(0.05, backgroundColor) : 'rgba(0, 0, 0, 0.1)'
        };
      }
    `;
  }}
`;
const CheckContainer = styled(Div)`
  ${({ color, variant }: UsefulDropdownState) => {
    const { colors } = useTheme();

    return `
      display: flex;
      align-items: center;
      justify-content: center;

      color: ${getFontColorFromVariant(variant, tint(0.5, color || colors.grayMedium))};
      padding-right: 0.2rem;
      width: 2rem;
    `;
  }}
`;

const PlaceholderContainer = styled(Text.Container)`
  opacity: 0.8;
`;

export interface DropdownProps {
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledValueContainer?: string & StyledComponentBase<any, {}>;
  StyledValueItem?: string & StyledComponentBase<any, {}>;
  StyledOptionsContainer?: string & StyledComponentBase<any, {}>;
  StyledOptionItem?: string & StyledComponentBase<any, {}>;
  StyledCheckContainer?: string & StyledComponentBase<any, {}>;
  StyledPlaceholder?: (string & StyledComponentBase<any, {}>) | typeof Text;

  containerProps?: SubcomponentPropsType;
  valueContainerProps?: SubcomponentPropsType;
  valueItemProps?: SubcomponentPropsType;
  optionsContainerProps?: SubcomponentPropsType;
  optionItemProps?: SubcomponentPropsType;
  checkContainerProps?: SubcomponentPropsType;
  placeholderProps?: SubcomponentPropsType;

  color?: string;
  elevation?: number;
  multi?: boolean;
  name: string;
  placeholder?: string;

  onBlur?: () => void;
  onClear?: () => void;
  onSelect: (selected?: Array<string | number>) => void;

  values?: Array<string | number>;
  options?: Array<OptionProps>;
  tabIndex?: number;
  variant?: variants;
  optionsVariant?: variants;
}

const Dropdown = ({
  StyledContainer = Container,
  StyledValueContainer = ValueContainer,
  StyledValueItem = ValueItem,
  StyledOptionsContainer = OptionsContainer,
  StyledOptionItem = OptionItem,
  StyledCheckContainer = CheckContainer,
  StyledPlaceholder = Text,

  containerProps,
  valueContainerProps,
  valueItemProps,
  optionsContainerProps,
  optionItemProps,
  checkContainerProps,
  placeholderProps,

  color,
  elevation = 0,
  multi = false,
  name,
  placeholder,
  onBlur,
  onClear,
  onSelect,
  options = [],
  tabIndex = 0,
  variant = variants.outline,
  optionsVariant = variant,
  values = [],
}: DropdownProps): JSX.Element | null => {
  const { colors } = useTheme();
  const defaultedColor = color || colors.grayDark;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Merge the default styled container prop and the placeholderProps object to get user styles
  const placeholderMergedProps = {
    StyledContainer: PlaceholderContainer,
    ...placeholderProps,
  };

  const optionsHash: { [key: string]: OptionProps } = {};
  options.forEach(option => {
    optionsHash[option.id] = { ...option, isSelected: values.includes(option.id) };
  });

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      e.preventDefault();
      const target = e.nativeEvent.relatedTarget as HTMLElement | null;
      // check if we're focusing on something we don't control
      if (!target || (target.id && !target.id.startsWith(name))) {
        setIsOpen(false);
        if (onBlur) {
          onBlur();
        }
      }
    },
    [name, onBlur],
  );

  const handleSelect = useCallback(
    (clickedId: string | number) => {
      if (!multi) {
        setIsOpen(false);
        onSelect([clickedId]);
      } else {
        const previouslySelected = optionsHash[clickedId].isSelected;
        const newValues = previouslySelected
          ? values.filter(val => val !== clickedId)
          : [...values, clickedId];
        onSelect(newValues);
      }
    },
    [onSelect, multi, values, optionsHash],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      onSelect(multi ? [] : undefined);
      if (onClear) {
        onClear();
      }
    },
    [multi, onClear, onSelect],
  );

  // clickHandler will be used in onMouseDown to prevent the focus event
  // opening the dropdown and the click closing it
  const clickHandler = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      setIsOpen(!isOpen);
      if (containerRef && containerRef.current) {
        // Focus the container even when clicking
        containerRef.current.focus();
      }
    },
    [containerRef, isOpen, setIsOpen],
  );

  const keyDownHandler = useCallback(
    ({ key }) => {
      // setTimeout(0) needed when responding to key events to push back call
      // to activeElement to after it is updated in the DOM
      window.setTimeout(() => {
        const focusedElement = document.activeElement;
        switch (key) {
          case 'Enter':
            const match = focusedElement && focusedElement.id.match(`${name}-option-(.*)`);
            if (match) {
              handleSelect(match[1]);
            }
            break;
          case 'ArrowUp':
            if (focusedElement && focusedElement.id.match(`${name}-option-.*`)) {
              const sibling = focusedElement.previousElementSibling as HTMLElement | null;
              if (sibling) {
                sibling.focus();
              }
            }
            break;
          case 'ArrowDown':
            if (focusedElement && focusedElement.id === `${name}-container`) {
              const optionsContainer = focusedElement.children[1];
              if (optionsContainer) {
                const toFocus = optionsContainer.children[0] as HTMLElement | undefined;
                if (toFocus) {
                  toFocus.focus();
                }
              }
            } else if (focusedElement && focusedElement.id.match(`${name}-option-.*`)) {
              const sibling = focusedElement.nextElementSibling as HTMLElement | null;
              if (sibling) {
                sibling.focus();
              }
            }
            break;
          default:
            break;
        }
      }, 0);
    },
    [handleSelect, name],
  );

  useEffect(() => {
    window.removeEventListener('keydown', keyDownHandler);
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [keyDownHandler]);

  const closeIcons = (
    <ValueIconContainer>
      {onClear && values.length > 0 && (
        <CloseIconContainer
          onClick={handleClear}
          onFocus={(e: React.FocusEvent) => e.stopPropagation()}
          tabIndex={tabIndex}
        >
          <Icon path={mdiClose} size="1em" />
        </CloseIconContainer>
      )}
      <Icon path={isOpen ? mdiMenuUp : mdiMenuDown} size="1.25em" />
    </ValueIconContainer>
  );

  return (
    <StyledContainer
      data-test-id={`${name}-container`}
      id={`${name}-container`}
      elevation={elevation}
      isOpen={isOpen}
      name={name}
      onBlur={handleBlur}
      onFocus={(e: React.FocusEvent) => {
        e.preventDefault();
        setIsOpen(true);
      }}
      ref={containerRef}
      tabIndex={tabIndex}
      {...containerProps}
    >
      <Button
        StyledContainer={StyledValueContainer}
        containerProps={{
          modalIsOpen: isOpen,
        }}
        id={`${name}-button-value`}
        color={defaultedColor}
        onClick={(e: React.MouseEvent) => e.preventDefault()}
        onMouseDown={clickHandler}
        variant={variant}
        {...valueContainerProps}
      >
        <StyledValueItem
          {...valueItemProps}
          onMouseDown={clickHandler}
          onBlur={handleBlur}
          id={`${name}-value-item`}
        >
          {values
            .filter(val => val !== undefined && optionsHash[val] !== undefined)
            .map((val, i) =>
              optionsHash[val] !== undefined ? (
                <span key={val}>
                  {i !== 0 && ', '}
                  {optionsHash[val].optionValue}
                </span>
              ) : (
                undefined
              ),
            )}
          {(!values || !values.length) && (
            <StyledPlaceholder {...placeholderMergedProps}>{placeholder}</StyledPlaceholder>
          )}
        </StyledValueItem>
        {closeIcons}
      </Button>
      {true && (
        // {isOpen && (
        <StyledOptionsContainer
          color={defaultedColor}
          variant={optionsVariant}
          {...optionsContainerProps}
        >
          {options.map(option => (
            <StyledOptionItem
              id={`${name}-option-${option.id}`}
              key={`${name}-option-${option.id}`}
              onBlur={handleBlur}
              onClick={() => handleSelect(option.id)}
              tabIndex={tabIndex}
              color={defaultedColor}
              variant={optionsVariant}
              multi={multi}
              selected={optionsHash[option.id].isSelected}
              {...optionItemProps}
            >
              {multi && (
                <StyledCheckContainer
                  color={defaultedColor}
                  selected={optionsHash[option.id].isSelected}
                  variant={optionsVariant}
                  multi={multi}
                  {...checkContainerProps}
                >
                  {optionsHash[option.id].isSelected && <Icon path={mdiCheck} size="1em" />}
                </StyledCheckContainer>
              )}
              <Span>{option.optionValue}</Span>
            </StyledOptionItem>
          ))}
        </StyledOptionsContainer>
      )}
    </StyledContainer>
  );
};

Dropdown.Container = Container;
Dropdown.OptionsContainer = OptionsContainer;
Dropdown.OptionItem = OptionItem;
Dropdown.ValueContainer = ValueContainer;
Dropdown.ValueItem = ValueItem;
Dropdown.Placeholder = Text;

export default Dropdown;
