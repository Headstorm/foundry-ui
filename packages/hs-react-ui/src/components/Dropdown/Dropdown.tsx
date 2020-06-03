import React, {useCallback, useEffect, useState} from 'react';
import styled, { StyledComponentBase } from 'styled-components';

const Container = styled.div`
  border: 0.1rem solid black;
  height: 10rem;
  width: 10rem;
`;

const ValueContainer = styled.div`
  background: white;
  
  cursor: pointer;
  height: 100%;
  width: 100%;
`;

const ValueItem = styled.div`
  background: green;
  margin: 0 0.5rem 0;
  
  width: fit-content;
  height: fit-content;
`;

const OptionsContainer = styled.div`
  background: white;
  position: absolute;
  max-height: 10rem;
  width: 10rem;
`;

const OptionItem = styled.div`
  &:focus,
  &:hover {
    cursor: pointer;
    background: skyblue;
  }
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

  multi = false,
  name,
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
    // FIXME make this a little more robust so we don't accidentally respond to outside events
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
            const optionsContainer = focusedElement.nextElementSibling;
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
    <StyledContainer>
      <StyledValueContainer
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
        {((values.length && values) || state.selectedValues).map(val => (
          <StyledValueItem key={`${state.id}-value-${val}`}>
            {val}
          </StyledValueItem>
          ))
        }
      </StyledValueContainer>
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
            >{opt} {state.selectedValues.includes(opt) ? 'selected' : ''}</StyledOptionItem>
          ))}
        </StyledOptionsContainer>
      }
    </StyledContainer>
  );
};