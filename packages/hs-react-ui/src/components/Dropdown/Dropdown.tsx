import React, {useCallback, useEffect, useState} from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose, mdiMenuDown, mdiMenuUp } from '@mdi/js';
import { readableColor } from 'polished';

import Button from '../Button';
import { ButtonContainer } from '../Button/Button';
import colors from '../../enums/colors';

const Container = styled.div`
  width: fit-content;
`;
const ValueContainer = styled(ButtonContainer)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  
  line-height: initial;
  width: 15rem;
  padding: 0.5rem;
`;
const ValueIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  
  width: 3rem;
`

const ValueItem = styled.div`
  width: 100%;
  text-align: left;
`;

const OptionsContainer = styled.div`
  background: white;
  position: absolute;
  max-height: 10rem;
  overflow-y: scroll;
  width: 15rem;
  border: 0.5px solid ${colors.blueCharcoal25};
`;

const OptionItem = styled.div`
  height: 2rem;
  display: flex;
  align-items: center;
  
  font-family: Montserrat,Roboto,sans-serif;
  
  &:focus,
  &:hover {
    background: ${colors.blueCharcoal50};
    cursor: pointer;
    outline: none;
  }
`
const CheckContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  padding-right: 0.2rem;
  width: 2rem;
`

export interface DropdownProps {
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledValueContainer?: string & StyledComponentBase<any, {}>;
  StyledValueItem?: string & StyledComponentBase<any, {}>;
  StyledOptionsContainer?: string & StyledComponentBase<any, {}>;
  StyledOptionItem?: string & StyledComponentBase<any, {}>;

  clearable?: boolean,
  multi?: boolean,
  name: string,
  onClear?: () => void,
  onSelect?: (selected: string | Array<string>) => void,
  options: Array<string>,
  tabIndex?: number,
  values?: Array<string>,
}

// TODO @Jake
//  Placeholder text -- Wait until input is finalized
//  Aware of where it opens so it can open up
export const Dropdown = ({
  StyledContainer = Container,
  StyledValueContainer = ValueContainer,
  StyledValueItem = ValueItem,
  StyledOptionsContainer = OptionsContainer,
  StyledOptionItem = OptionItem,

  clearable = false,
  multi = false,
  name,
  onClear = () => {},
  onSelect = () => {},
  options,
  tabIndex = 0,
  values = [],
}: DropdownProps) => {
  const [state, setState] = useState<{ isOpen: boolean, selectedValues: Array<string>, id: string}>({
    isOpen: false,
    selectedValues: values,
    id: name
  });

  const handleBlur = useCallback((e: React.FocusEvent) => {
    e.preventDefault();
    const target = e.nativeEvent.relatedTarget as HTMLElement | null;
    // check if we're focusing on something we don't control
    if (!target || (target.id && !target.id.startsWith(state.id)) ) {
      setState(state => ({ ...state, isOpen: false }));
    }
  }, [state.id]);

  const handleSelect = useCallback((selected: string) => {
    setState(myState => {
      if (multi) {
        const selectedValues = myState.selectedValues.includes(selected)
          ? myState.selectedValues.filter(val => val !== selected)
          : [...myState.selectedValues, selected];

        onSelect(selectedValues);
        return {
          ...myState,
          isOpen: true,
          selectedValues,
        };
      }
      onSelect(selected);
      return { ...myState, selectedValues: [selected], isOpen: false }
    });
  }, [onSelect, multi]);

  const handleClear = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(curState => ({
      ...curState,
      selectedValues: [],
    }));
    onClear();
  }, []);

  const keyDownHandler = useCallback(({ key }) => {
    // setTimeout(0) needed when responding to key events to push back call
    // to activeElement to after it is updated in the DOM
    window.setTimeout(() => {
      const focusedElement = document.activeElement;
      switch (key) {
        case 'Enter':
          const match = focusedElement && focusedElement.id.match(`${state.id}-option-(.*)`)
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
          // FIXME @Jake: Simplify this logic
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
  }, [handleSelect, state.id]);

  useEffect(() => {
    window.removeEventListener('keydown', keyDownHandler);
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    }
  }, [keyDownHandler]);

  return (
    <StyledContainer
      data-testid={`${state.id}-valueContainer`}
      id={`${state.id}-valueContainer`}
      name={name}
      onBlur={handleBlur}
      onFocus={(e: React.FocusEvent) => {
        e.preventDefault();
        setState(state => ({ ...state, isOpen: true }));
      }}
      tabIndex={tabIndex}
    >
      <Button
        StyledContainer={StyledValueContainer}
        onClick={() => {}}
      >
        <StyledValueItem>{((values.length && values) || state.selectedValues).join(', ')}</StyledValueItem>
        <ValueIconContainer>
          {clearable && (
            <Icon
              onClick={handleClear}
              onFocus={(e: FocusEvent) => e.stopPropagation()}
              path={mdiClose}
              size={0.75}
              tabIndex={tabIndex}
            />
          )}
          <Icon path={state.isOpen ? mdiMenuUp : mdiMenuDown} size={0.75}/>
        </ValueIconContainer>
      </Button>
      {
        state.isOpen &&
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
                {state.selectedValues.includes(opt) &&
                  (<Icon
                    path={mdiCheck}
                    size={0.75}
                    color={readableColor(colors.blueCharcoal50, colors.success)}
                  />)
                }
              </CheckContainer>
              <span>{opt}</span>
            </StyledOptionItem>
          ))}
        </StyledOptionsContainer>
      }
    </StyledContainer>
  );
};