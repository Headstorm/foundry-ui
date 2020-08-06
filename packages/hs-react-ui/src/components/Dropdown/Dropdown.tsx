import React, { useCallback, useEffect, useState } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose, mdiMenuDown, mdiMenuUp } from '@mdi/js';
import { readableColor } from 'polished';

import Button, { ButtonVariants } from '../Button/Button';
import timings from '../../enums/timings';
import { Div, Span } from '../../htmlElements';
import Text from '../Text/Text';
import { useColors } from '../../context';
import { SubcomponentPropsType } from '../commonTypes';

export type OptionProps = {
  id: number | string;
  optionValue: ReactNode;
  isSelected?: boolean;
};

type UsefulDropdownState = {
  color: string;
  multi?: boolean;
  selected?: boolean;
  variant?: variants;
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
  ${() => {
    const { grayDark25 } = useColors();
    return `
      background: white;
      position: absolute;
      top: 100%;
      left: 0px;
      max-height: 10rem;
      overflow-y: scroll;
      width: 15rem;
      border: 0.5px solid ${grayDark25};
      border-radius: 0rem 0rem 0.25rem 0.25rem;
      z-index: 1000;
    `;
  }}
`;

const OptionItem = styled(Div)`
  ${() => {
    const { grayDark50 } = useColors();
    return `  
      padding: 0.5rem;
      display: flex;
      align-items: center;
    
      &:hover {
        background: ${grayDark50};
        cursor: pointer;
        outline: none;
      }
      &:focus {
        outline: none;
      }`;
  }}
`;
const CheckContainer = styled(Div)`
  display: flex;
  align-items: center;
  justify-content: center;

  padding-right: 0.2rem;
  width: 2rem;
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

  clearable?: boolean;
  color?: string;
  elevation?: number;
  multi?: boolean;
  name: string;
  onBlur?: () => void;
  onClear?: () => void;
  onSelect?: (selected: string | Array<string>) => void;
  options: Array<string>;
  tabIndex?: number;
  type?: ButtonVariants;
  values?: Array<string>;
}

// TODO Placeholder text -- Wait until input is finalized
const Dropdown = ({
  StyledContainer = Container,
  StyledValueContainer = ValueContainer,
  StyledValueItem = ValueItem,
  StyledOptionsContainer = OptionsContainer,
  StyledOptionItem = OptionItem,

  clearable = false,
  color,
  elevation = 0,
  multi = false,
  name,
  onBlur,
  onClear,
  onSelect,
  options,
  tabIndex = 0,
  type = Button.ButtonVariants.fill,
  values = [],
}: DropdownProps): JSX.Element | null => {
  const [state, setState] = useState<{
    isOpen: boolean;
    selectedValues: Array<string>;
    id: string;
  }>({
    isOpen: false,
    selectedValues: values,
    id: name,
  });
  const colors = useColors();

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      e.preventDefault();
      const target = e.nativeEvent.relatedTarget as HTMLElement | null;
      // check if we're focusing on something we don't control
      if (!target || (target.id && !target.id.startsWith(state.id))) {
        setState(curState => ({ ...curState, isOpen: false }));
        if (onBlur) {
          onBlur();
        }
      }
    },
    [state.id, onBlur],
  );

  const handleSelect = useCallback(
    (selected: string) => {
      setState(myState => {
        if (multi) {
          const selectedValues = myState.selectedValues.includes(selected)
            ? myState.selectedValues.filter(val => val !== selected)
            : [...myState.selectedValues, selected];
          if (onSelect) {
            onSelect(selectedValues);
          }
          return {
            ...myState,
            isOpen: true,
            selectedValues,
          };
        }
        if (onSelect) {
          onSelect(selected);
        }
        return { ...myState, selectedValues: [selected], isOpen: false };
      });
    },
    [onSelect, multi],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setState(curState => ({
        ...curState,
        selectedValues: [],
      }));
      if (onClear) {
        onClear();
      }
    },
    [onClear],
  );

  const keyDownHandler = useCallback(
    ({ key }) => {
      // setTimeout(0) needed when responding to key events to push back call
      // to activeElement to after it is updated in the DOM
      window.setTimeout(() => {
        const focusedElement = document.activeElement;
        switch (key) {
          case 'Enter':
            const match = focusedElement && focusedElement.id.match(`${state.id}-option-(.*)`);
            if (match) {
              handleSelect(match[1]);
            }
            break;
          case 'ArrowUp':
            if (focusedElement && focusedElement.id.match(`${state.id}-option-.*`)) {
              const sibling = focusedElement.previousElementSibling as HTMLElement | null;
              if (sibling) {
                sibling.focus();
              }
            }
            break;
          case 'ArrowDown':
            if (focusedElement && focusedElement.id === `${state.id}-valueContainer`) {
              const optionsContainer = focusedElement.children[1];
              if (optionsContainer) {
                const toFocus = optionsContainer.children[0] as HTMLElement | undefined;
                if (toFocus) {
                  toFocus.focus();
                }
              }
            } else if (focusedElement && focusedElement.id.match(`${state.id}-option-.*`)) {
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
    [handleSelect, state.id],
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
      {clearable && (
        <CloseIconContainer
          onClick={handleClear}
          onFocus={(e: React.FocusEvent) => e.stopPropagation()}
          tabIndex={tabIndex}
        >
          <Icon path={mdiClose} size={0.75} />
        </CloseIconContainer>
      )}
      <Icon path={state.isOpen ? mdiMenuUp : mdiMenuDown} size={0.75} />
    </ValueIconContainer>
  );

  return (
    <StyledContainer
      data-testid={`${state.id}-valueContainer`}
      elevation={elevation}
      isOpen={state.isOpen}
      id={`${state.id}-valueContainer`}
      name={name}
      onBlur={handleBlur}
      onFocus={(e: React.FocusEvent) => {
        e.preventDefault();
        setState(curState => ({ ...curState, isOpen: true }));
      }}
      tabIndex={tabIndex}
    >
      <Button
        StyledContainer={StyledValueContainer}
        containerProps={{
          modalIsOpen: state.isOpen,
        }}
        color={color}
        onClick={(e: React.MouseEvent) => e.preventDefault()}
        variant={type}
      >
        <StyledValueItem {...valueItemProps}>
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
      {state.isOpen && (
        <StyledOptionsContainer>
          {options.map(opt => (
            <StyledOptionItem
              id={`${state.id}-option-${opt}`}
              key={`${state.id}-option-${opt}`}
              onBlur={handleBlur}
              onClick={() => handleSelect(opt)}
              tabIndex={tabIndex}
            >
              <CheckContainer>
                {state.selectedValues.includes(opt) && (
                  <Icon
                    path={mdiCheck}
                    size={0.75}
                    color={readableColor(colors.grayDark50, colors.success)}
                  />
                )}
              </CheckContainer>
              <span>{opt}</span>
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
