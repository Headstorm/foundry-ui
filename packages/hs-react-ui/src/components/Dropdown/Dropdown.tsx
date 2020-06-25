import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose, mdiMenuDown, mdiMenuUp } from '@mdi/js';
import { shade, tint, getLuminance } from 'polished';

import Button, { ButtonVariants } from '../Button/Button';
import colors from '../../enums/colors';
import timings from '../../enums/timings';
import { Div } from '../../htmlElements';
import { getFontColorFromVariant, getBackgroundColorFromVariant } from '../../utils/color';

export type OptionProps = {
  id: number | string;
  optionValue: ReactNode;
  isSelected?: boolean;
};

const Container = styled(Div)`
  ${({ elevation, isOpen }) => {
    const shadowYOffset = elevation && elevation >= 1 ? (elevation - 1) * 0.5 + 0.1 : 0;
    const shadowBlur = elevation && elevation >= 1 ? (elevation - 1) * 0.5 + 0.1 : 0;
    const shadowOpacity = 0.5 - elevation * 0.075;

    return `
      width: fit-content;
      transition: filter ${timings.slow};
      filter: drop-shadow(0rem ${shadowYOffset}rem ${shadowBlur}rem rgba(0,0,0,${shadowOpacity}));
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
  ${({ multi, selected, variant, color }) => `
    
    /* use extra props for ts */
    ${multi ? '' : ''}
    ${variant ? '' : ''}
    ${selected ? '' : ''}
  
    background: white;
    position: absolute;
    top: 100%;
    left: 0px;
    max-height: 10rem;
    overflow-y: scroll;
    width: 15rem;
    border: 1px solid ${getFontColorFromVariant('outline', color)};
    border-top: 0px solid transparent;
    border-radius: 0rem 0rem 0.25rem 0.25rem;
    z-index: 1000;
  `}
`;

const OptionItem = styled(Div)`
  ${({ multi, selected, variant, color }) => {
    const selectedBgColor = getLuminance(color) > 0.5 ? shade(0.125, color) : tint(0.5, color);
    return `
    padding: 0.5rem;
    display: flex;
    align-items: center;
    color: ${selected ? getFontColorFromVariant('fill', selectedBgColor) : colors.grayDark};
    background-color: ${
      selected ? getBackgroundColorFromVariant('fill', selectedBgColor) : 'transparent'
    };

    /* use extra props for ts */
    ${multi ? '' : ''}
    ${variant ? '' : ''}

    &:hover {
      background-color: ${shade(
        0.1,
        selected ? getBackgroundColorFromVariant('fill', selectedBgColor) : 'white',
      )};
      cursor: pointer;
      outline: none;
    }
    &:focus {
      outline: none;
    }
  `;
  }}
`;
const CheckContainer = styled(Div)`
  ${({ selected, variant, color }) => `
    ${selected ? '' : ''}
    ${variant ? '' : ''}

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${getFontColorFromVariant('fill', tint(0.5, color || colors.grayMedium))};
    padding-right: 0.2rem;
    width: 2rem;
  `}
`;

export interface DropdownProps {
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledValueContainer?: string & StyledComponentBase<any, {}>;
  StyledValueItem?: string & StyledComponentBase<any, {}>;
  StyledOptionsContainer?: string & StyledComponentBase<any, {}>;
  StyledOptionItem?: string & StyledComponentBase<any, {}>;

  color?: string;
  elevation?: number;
  multi?: boolean;
  name: string;

  onBlur?: () => void;
  onClear?: () => void;
  onSelect: (selected?: Array<string | number>) => void;

  values?: Array<string | number>;
  options?: Array<OptionProps>;
  tabIndex?: number;
  variant?: ButtonVariants;
}

// TODO Placeholder text -- Wait until input is finalized
const Dropdown = ({
  StyledContainer = Container,
  StyledValueContainer = ValueContainer,
  StyledValueItem = ValueItem,
  StyledOptionsContainer = OptionsContainer,
  StyledOptionItem = OptionItem,

  color,
  elevation = 0,
  multi = false,
  name,
  onBlur,
  onClear,
  onSelect,
  options = [],
  tabIndex = 0,
  variant = ButtonVariants.fill,
  values = [],
}: DropdownProps): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      e.stopPropagation();
      onSelect(multi ? [] : undefined);
      if (onClear) {
        onClear();
      }
    },
    [multi, onClear, onSelect],
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
              handleSelect(match[1]); // TODO: fix this
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
            if (focusedElement && focusedElement.id === `${name}-valueContainer`) {
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
      data-testid={`${name}-valueContainer`}
      elevation={elevation}
      isOpen={isOpen}
      id={`${name}-valueContainer`}
      name={name}
      onBlur={handleBlur}
      onFocus={(e: React.FocusEvent) => {
        e.preventDefault();
        setIsOpen(true);
      }}
      tabIndex={tabIndex}
    >
      <Button
        StyledContainer={StyledValueContainer}
        containerProps={{
          modalIsOpen: isOpen,
        }}
        color={color}
        onClick={(e: React.MouseEvent) => e.preventDefault()}
        variant={variant}
      >
        <StyledValueItem>
          {values
            .filter(val => val !== undefined)
            .map(val =>
              optionsHash[val] !== undefined ? optionsHash[val].optionValue : undefined,
            )}
        </StyledValueItem>
        {closeIcons}
      </Button>
      {isOpen && (
        <StyledOptionsContainer color={color} variant={variant}>
          {options.map(option => (
            <StyledOptionItem
              id={`${name}-option-${option.id}`}
              key={`${name}-option-${option.id}`}
              onBlur={handleBlur}
              onClick={() => handleSelect(option.id)}
              tabIndex={tabIndex}
              color={color}
              variant={variant}
              multi={multi}
              selected={optionsHash[option.id].isSelected}
            >
              {multi && (
                <CheckContainer
                  color={color}
                  seleted={optionsHash[option.id].isSelected}
                  variant={variant}
                >
                  {optionsHash[option.id].isSelected && <Icon path={mdiCheck} size="1em" />}
                </CheckContainer>
              )}
              <span>{option.optionValue}</span>
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

export default Dropdown;
