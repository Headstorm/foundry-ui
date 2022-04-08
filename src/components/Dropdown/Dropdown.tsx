import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose, mdiMenuDown, mdiMenuUp } from '@mdi/js';
import { shade, tint, getLuminance, darken, readableColor } from 'polished';

import { Components, ListRange, Virtuoso } from 'react-virtuoso';
import Fuse from 'fuse.js';
import { useAnalytics, useTheme } from '../../context';
import Button from '../Button/Button';
import variants from '../../enums/variants';
import timings from '../../enums/timings';
import { Div, Span, Input } from '../../htmlElements';
import Tag, { TagProps } from '../Tag/Tag';
import { getFontColorFromVariant, getBackgroundColorFromVariant } from '../../utils/color';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';
import { getShadowStyle, getDropdownTagStyle } from '../../utils/styles';
import { mergeRefs } from '../../utils/refs';
import TextInput, { TextInputProps } from '../TextInput/TextInput';

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
  isOpenedBelow?: boolean;
  isHidden?: boolean;
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
  ${({ isOpen, isOpenedBelow, isHidden }) => {
    const { colors } = useTheme();
    const openedDirection = isOpenedBelow ? 'bottom' : 'top';
    const openStyle = `
      border-${openedDirection}: 0px solid transparent;
      border-${openedDirection}-right-radius: 0rem;
      border-${openedDirection}-left-radius: 0rem;
    `;

    return `
      user-select: none;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;
      ${isOpen && !isHidden ? openStyle : ''}
      width: 15em;
      padding: .5em 1em;

      &:focus-within {
        outline: none;
        box-shadow: 0 0 5px 0.150rem ${colors.tertiaryDark};
      }
    `;
  }}
`;

// TODO: Don't use explicit height here - this div is ending up larger than the icon otherwise
export const CloseIconContainer = styled(Div)`
  height: 1.125em;
  z-index: 1;
`;

export const ArrowIconContainer = styled(Div)`
  height: 1.125em;
  z-index: 1;
  pointer-events: none;
`;

const ValueItem = styled(Div)`
  width: 100%;
  text-align: left;
`;

const OptionsContainer = styled(Div)`
  ${({
    color,
    variant,
    isOpenedBelow,
    isHidden,
    isVirtual,
  }: UsefulDropdownState & { isVirtual: boolean }) => {
    const direction = isOpenedBelow ? 'top' : 'bottom';
    const borderRadii = isOpenedBelow ? '0rem 0rem 0.25rem 0.25rem' : '0.25rem 0.25rem 0rem 0rem';

    return `
    background: white;
    position: absolute;
    left: 0px;
    ${isVirtual ? 'height: 10em;' : 'max-height: 10em;'}
    overflow-y: auto;
    width: 15em;
    ${
      variant !== variants.text
        ? `
            border: 1px solid ${color};
          `
        : ''
    }
    z-index: 1000;
    ${direction}: 100%;
    border-${direction}: 0px solid transparent;
    border-radius: ${borderRadii};
    ${isHidden ? 'visibility: hidden;' : ''}
  `;
  }}
`;

const HiddenOptionsContainer = styled(OptionsContainer)`
  ${({ isOpenedBelow }) => {
    const direction = isOpenedBelow ? 'top' : 'bottom';

    return `
    visibility: hidden;
    ${direction}: 100%;
  `;
  }}
`;

const OptionItem = styled(Div)`
  ${({ selected, color, variant }: UsefulDropdownState) => {
    const { colors } = useTheme();
    const unselectedBgColor = getBackgroundColorFromVariant(variant, color);
    const selectedBgColor = getLuminance(color) > 0.5 ? shade(0.125, color) : tint(0.5, color);
    const backgroundColor = selected ? selectedBgColor : unselectedBgColor;
    return `
      user-select: none;
      padding: 0.5em;
      display: flex;
      align-items: center;
      color: ${
        selected
          ? readableColor(backgroundColor, colors.background, color, true)
          : getFontColorFromVariant(variant, color)
      };
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
  ${({ color }: UsefulDropdownState) => {
    const { colors } = useTheme();
    const backgroundColor = getLuminance(color) > 0.5 ? shade(0.125, color) : tint(0.5, color);
    return `
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${readableColor(backgroundColor, colors.background, color, true)};
      padding-right: 0.2em;
      width: 2em;
    `;
  }}
`;

const PlaceholderContainer = styled(Div)`
  position: absolute;
  opacity: 0.8;
`;

const ValueItemTagContainer = styled(Tag.Container)`
  ${({
    dropdownVariant,
    tagVariant,
    dropdownColor,
    transparentColor,
  }: {
    dropdownVariant: variants;
    tagVariant: variants;
    dropdownColor: string;
    transparentColor: string;
  }) => `
    ${
      tagVariant === variants.text
        ? `
          padding: 0;
          line-height: 1;
          margin-top: 0 !important;
        `
        : ''
    }
    ${getDropdownTagStyle(dropdownVariant, tagVariant, dropdownColor, transparentColor)}
  `}
`;

const StyledSearchContainer = styled(Div)``;

const StyledSearchInput = styled(Input)`
  all: inherit;
`;

export interface DropdownProps {
  StyledContainer?: StyledSubcomponentType;
  StyledValueContainer?: StyledSubcomponentType;
  StyledValueItem?: StyledSubcomponentType;
  StyledValueItemTagContainer?: StyledSubcomponentType;
  StyledOptionsContainer?: StyledSubcomponentType;
  StyledHiddenOptionsContainer?: StyledSubcomponentType;
  StyledOptionItem?: StyledSubcomponentType;
  StyledCheckContainer?: StyledSubcomponentType;
  StyledPlaceholder?: StyledSubcomponentType;
  StyledCloseIconContainer?: StyledSubcomponentType;
  StyledArrowIconContainer?: StyledSubcomponentType;

  containerProps?: SubcomponentPropsType;
  valueContainerProps?: SubcomponentPropsType;
  valueItemProps?: SubcomponentPropsType;
  valueItemTagProps?: TagProps;
  optionsContainerProps?: SubcomponentPropsType;
  optionItemProps?: SubcomponentPropsType;
  checkContainerProps?: SubcomponentPropsType;
  placeholderProps?: SubcomponentPropsType;
  closeIconProps?: SubcomponentPropsType;
  arrowIconProps?: SubcomponentPropsType;

  containerRef?: React.RefObject<HTMLElement>;
  optionsContainerRef?: React.RefObject<HTMLElement>;
  hiddenOptionsContainerRef?: React.RefObject<HTMLElement>;
  optionItemRef?: React.RefObject<HTMLElement>;
  valueContainerRef?: React.RefObject<HTMLButtonElement>;
  valueItemRef?: React.RefObject<HTMLElement>;
  valueItemTagRef?: React.RefObject<HTMLElement>;
  checkContainerRef?: React.RefObject<HTMLElement>;
  placeholderRef?: React.RefObject<HTMLElement>;
  closeIconRef?: React.RefObject<HTMLElement>;
  arrowIconRef?: React.RefObject<HTMLElement>;

  color?: string;
  elevation?: number;
  multi?: boolean;
  name?: string;
  placeholder?: string;

  componentUUID?: string;

  onBlur?: () => void;
  onFocus?: () => void;
  onClear?: () => void;
  onSelect: (selected?: Array<string | number>) => void;

  rememberScrollPosition?: boolean;

  values?: Array<string | number>;
  options?: Array<OptionProps>;
  tabIndex?: number;
  variant?: variants;
  optionsVariant?: variants;
  valueVariant?: variants;

  shouldStayInView?: boolean;
  intersectionThreshold?: number;
  intersectionContainer?: HTMLElement | null;
  intersectionObserverPrecision?: number;
  virtualizeOptions?: boolean;

  searchable?: boolean;
  searchFiltersOptions?: boolean;
  onSearchChange?: TextInputProps['onChange'];
  onDebouncedSearchChange?: TextInputProps['debouncedOnChange'];
}

const defaultCallback = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

const Dropdown = ({
  StyledContainer = Container,
  StyledValueContainer = ValueContainer,
  StyledValueItem = ValueItem,
  StyledValueItemTagContainer = ValueItemTagContainer,
  StyledOptionsContainer = OptionsContainer,
  StyledHiddenOptionsContainer = HiddenOptionsContainer,
  StyledOptionItem = OptionItem,
  StyledCheckContainer = CheckContainer,
  StyledPlaceholder = PlaceholderContainer,
  StyledCloseIconContainer = CloseIconContainer,
  StyledArrowIconContainer = ArrowIconContainer,

  containerProps,
  valueContainerProps,
  valueItemProps,
  optionsContainerProps,
  optionItemProps,
  checkContainerProps,
  placeholderProps,
  closeIconProps,
  arrowIconProps,
  valueItemTagProps = {},

  containerRef,
  optionsContainerRef,
  hiddenOptionsContainerRef,
  optionItemRef,
  valueContainerRef,
  valueItemRef,
  valueItemTagRef,
  checkContainerRef,
  placeholderRef,
  closeIconRef,
  arrowIconRef,

  color,
  elevation = 0,
  multi = false,
  name = 'dropdown',
  placeholder,

  onBlur,
  onFocus,
  onClear,
  onSelect,
  options = [],
  tabIndex = 0,
  variant = variants.outline,
  optionsVariant = variants.outline,
  rememberScrollPosition = true,
  valueVariant = variants.text,
  values = [],
  shouldStayInView = true,
  intersectionThreshold = 1.0,
  intersectionContainer = null,
  intersectionObserverPrecision = 100,
  virtualizeOptions = true,

  searchable = false,
  searchFiltersOptions = true,
  onSearchChange = defaultCallback,
  onDebouncedSearchChange = defaultCallback,
}: DropdownProps): JSX.Element | null => {
  const { colors } = useTheme();
  const defaultedColor = color || colors.grayDark;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerInternalRef = useRef<HTMLDivElement>(null);
  const optionsContainerInternalRef = useRef<HTMLDivElement>(null);
  const hiddenOptionsContainerInternalRef = useRef<HTMLDivElement>(null);

  const [focusWithin, setFocusWithin] = useState<boolean>(false);
  const [focusTimeoutId, setFocusTimeoutId] = useState<number>();

  const scrollPos = useRef<number>(0);

  const [isOpenedBelow, setIsOpenedBelow] = useState<boolean>(true);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [isPageScrollingDown, setIsPageScrollingDown] = useState<boolean | null>(null);
  const prevIntersectionRatio = useRef<number>(0.5);
  const ticking = useRef<boolean>(false);
  const [scrollIndex, setScrollIndex] = useState<number>(0);

  const [isOverflowing, setIsOverflowing] = useState<boolean>(true);

  const handleEventWithAnalytics = useAnalytics();

  const handleOnBlur = useCallback(
    (e: any) => handleEventWithAnalytics('Dropdown', onBlur || (() => {}), 'onBlur', e, { name }),
    [handleEventWithAnalytics, onBlur, name],
  );
  const handleOnFocus = useCallback(
    (e: any) => handleEventWithAnalytics('Dropdown', onFocus || (() => {}), 'onFocus', e, { name }),
    [handleEventWithAnalytics, onFocus, name],
  );
  const handleOnClear = useCallback(
    (e: any) => handleEventWithAnalytics('Dropdown', onClear || (() => {}), 'onClear', e, { name }),
    [handleEventWithAnalytics, onClear, name],
  );

  const isVirtual = virtualizeOptions && isOverflowing;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchCharacterCount, setSearchCharacterCount] = useState<number>(0);
  const [filteredOptions, setFilteredOptions] = useState<OptionProps[]>([]);
  const stringifiedOptions = JSON.stringify(options);

  useEffect(() => {
    setFilteredOptions(options);
    // empty array of options makes this useEffect loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedOptions]);

  // Merge the default styled container prop and the placeholderProps object to get user styles
  const placeholderMergedProps = {
    StyledContainer: PlaceholderContainer,
    ...placeholderProps,
  };

  // effect to determine if user is scrolling up or down
  useEffect(() => {
    if (isOpen && shouldStayInView) {
      const threshold = 0;
      let lastScrollY = window.pageYOffset;

      const updateScrollDir = () => {
        const scrollY = window.pageYOffset;

        if (Math.abs(scrollY - lastScrollY) < threshold) {
          ticking.current = false;
          return;
        }
        setIsPageScrollingDown(scrollY > lastScrollY);

        lastScrollY = scrollY > 0 ? scrollY : 0;
        ticking.current = false;
      };

      const onPageScroll = () => {
        if (!ticking.current) {
          window.requestAnimationFrame(updateScrollDir);
          ticking.current = true;
        }
      };
      window.addEventListener('scroll', onPageScroll);

      return () => window.removeEventListener('scroll', onPageScroll);
    }
    setIsPageScrollingDown(null);
  }, [isOpen, shouldStayInView]);

  const intersectOptions = useMemo(() => {
    const buildThresholdArray = () =>
      Array.from(
        Array(intersectionObserverPrecision).keys(),
        i => i / intersectionObserverPrecision,
      );

    return {
      root: intersectionContainer,
      rootMargin: '0px',
      threshold: buildThresholdArray(),
    };
  }, [intersectionContainer, intersectionObserverPrecision]);

  const intersectionCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (shouldStayInView) {
        if (entries.length === 1) {
          const [entry] = entries;
          if (
            entry.intersectionRatio < intersectionThreshold &&
            entry.target === optionsContainerInternalRef.current
          ) {
            // swap the dropdown to open downward if its hitting the top
            if (
              isPageScrollingDown &&
              !isOpenedBelow &&
              entry.intersectionRatio < prevIntersectionRatio.current
            ) {
              setIsOpenedBelow(true);
            } else if (
              isPageScrollingDown === false &&
              isOpenedBelow &&
              entry.intersectionRatio < prevIntersectionRatio.current
            ) {
              setIsOpenedBelow(false);
            }
          }
          prevIntersectionRatio.current = entry.intersectionRatio;
        } else if (entries.length === 2) {
          const [dropdown, invisibleDrop] = entries;
          // flip the view if the other direction is more visible in viewport
          // and the options container is less than the threshold
          if (
            dropdown.intersectionRatio < intersectionThreshold &&
            invisibleDrop.intersectionRatio > dropdown.intersectionRatio
          ) {
            setIsOpenedBelow(drop => !drop);
          }
        }
      }
      setIsHidden(false);
    },
    [shouldStayInView, intersectionThreshold, isPageScrollingDown, isOpenedBelow],
  );

  const intersectObserver = useMemo(
    () => new IntersectionObserver(intersectionCallback, intersectOptions),
    [intersectOptions, intersectionCallback],
  );

  const stringifiedFilteredOptions = JSON.stringify(filteredOptions);
  useEffect(() => {
    if (isOpen) {
      // setTimeout ensures this code renders after the initial render
      const timer = window.setTimeout(() => {
        const optionsContainer = optionsContainerInternalRef.current;
        const hiddenContainer = hiddenOptionsContainerInternalRef.current;

        if (optionsContainer) {
          if (isVirtual) {
            const virtuosoContainer = optionsContainer.firstElementChild;
            const virtuosoScroller = virtuosoContainer?.firstElementChild;
            if (virtuosoScroller && virtuosoScroller.clientHeight < optionsContainer.clientHeight) {
              setIsOverflowing(false);
            }
          } else if (optionsContainer.scrollHeight > optionsContainer.clientHeight) {
            setIsOverflowing(true);
          }
        }

        if (optionsContainer && hiddenContainer) {
          const optionsContainerHeight = optionsContainer.getBoundingClientRect().height;
          const hiddenContainerHeight = hiddenContainer.getBoundingClientRect().height;

          if (optionsContainerHeight !== hiddenContainerHeight) {
            // height is returned in pixels
            hiddenContainer.style.height = `${optionsContainerHeight}px`;
          }

          intersectObserver.observe(optionsContainer);
          intersectObserver.observe(hiddenContainer);
        }
      }, 0);
      return () => {
        clearTimeout(timer);
        intersectObserver.disconnect();
      };
    }
  }, [intersectObserver, isOpen, isVirtual, stringifiedFilteredOptions]);

  const optionsHash: { [key: string]: OptionProps } = useMemo(() => {
    const hash: { [key: string]: OptionProps } = {};
    options.forEach(option => {
      hash[option.id] = { ...option, isSelected: values.includes(option.id) };
    });

    return hash;
  }, [options, values]);

  const scrollListener = () => {
    scrollPos.current = optionsContainerInternalRef.current
      ? optionsContainerInternalRef.current.scrollTop
      : 0;
  };

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      e.preventDefault();
      e.persist();
      setFocusTimeoutId(
        window.setTimeout(() => {
          if (focusWithin) {
            setFocusWithin(false);
            setIsOpen(false);
            if (handleOnBlur) {
              handleOnBlur(e);
            }
          }
        }, 0),
      );
    },
    [handleOnBlur, focusWithin],
  );

  const handleFocus = useCallback(
    (e: any) => {
      e.persist();
      window.setTimeout(() => {
        if (document.activeElement?.id === `${name}-dropdown-button`) {
          searchInputRef?.current?.focus();
        }
      }, 0);

      clearTimeout(focusTimeoutId);

      if (!focusWithin) {
        setFocusWithin(true);
        // make sure there is no dropdown flickering when tabbing into dropdown
        setIsHidden(true);
        setIsOpenedBelow(true);
      }
      setIsOpen(true);

      if (handleOnFocus) {
        handleOnFocus(e);
      }
    },
    [focusTimeoutId, focusWithin, handleOnFocus, name],
  );

  const handleOnSelect = useCallback(
    (selected?: Array<string | number>) =>
      handleEventWithAnalytics('Dropdown', onSelect, 'onSelect', selected, { name }),
    [handleEventWithAnalytics, onSelect, name],
  );

  const handleSelect = useCallback(
    (clickedId: string | number) => {
      if (!multi) {
        setIsOpen(false);
        handleOnSelect([clickedId]);
      } else {
        const previouslySelected = optionsHash[clickedId].isSelected;
        const newValues = previouslySelected
          ? values.filter(val => val !== clickedId)
          : [...values, clickedId];
        handleOnSelect(newValues);
      }
    },
    [handleOnSelect, multi, values, optionsHash],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      handleOnSelect(multi ? [] : undefined);
      if (handleOnClear) {
        handleOnClear(e);
      }
    },
    [multi, handleOnClear, handleOnSelect],
  );

  const handleMouseDownOnButton = useCallback(
    (e: React.MouseEvent) => {
      if (isOpen) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - It's okay if target is null in this case as we want it to close regardless
        handleBlur(e);
      } else {
        setIsHidden(true);
        setIsOpenedBelow(true);
        handleFocus(e);
      }
    },
    [isOpen, handleBlur, handleFocus],
  );

  const keyDownHandler = useCallback(
    ({ key }) => {
      // setTimeout(0) needed when responding to key events to push back call
      // to activeElement to after it is updated in the DOM
      window.setTimeout(() => {
        const focusedElement = document.activeElement;

        if (!focusedElement) return;

        let optionToFocus;

        switch (key) {
          case 'Enter':
            const match = focusedElement.id.match(`${name}-option-(.*)`);
            if (match) {
              handleSelect(match[1]);
            }
            break;

          case 'ArrowUp':
            if (focusedElement.id.match(`${name}-option-.*`)) {
              if (isVirtual) {
                const row = focusedElement.parentElement;
                const rowPrevSibling = row ? row.previousElementSibling : null;
                if (rowPrevSibling) {
                  optionToFocus = rowPrevSibling.firstElementChild;
                }
              } else {
                optionToFocus = focusedElement.previousElementSibling;
              }
            }
            break;

          case 'ArrowDown':
            if (focusedElement.id === `${name}-dropdown-button`) {
              const optionsContainer = focusedElement?.nextElementSibling;
              if (isVirtual) {
                const virtuosoContainer = optionsContainer?.firstElementChild;
                const virtuosoScroller = virtuosoContainer?.firstElementChild;
                optionToFocus = virtuosoScroller?.firstElementChild?.firstElementChild;
              } else {
                optionToFocus = optionsContainer?.firstElementChild;
              }
            } else if (focusedElement.id.match(`${name}-option-.*`)) {
              if (isVirtual) {
                const row = focusedElement.parentElement;
                const rowNextSibling = row ? row.nextElementSibling : null;
                if (rowNextSibling) {
                  optionToFocus = rowNextSibling.firstElementChild;
                }
              } else {
                optionToFocus = focusedElement.nextElementSibling;
              }
            } else if (focusedElement.id === `${name}-search-input`) {
              const searchInputContainer = focusedElement.parentElement;
              const valueItemContainer = searchInputContainer?.parentElement;
              const button = valueItemContainer?.parentElement;
              const optionsContainer = button?.nextElementSibling;
              if (isVirtual) {
                const virtuosoContainer = optionsContainer?.firstElementChild;
                const virtuosoScroller = virtuosoContainer?.firstElementChild;
                optionToFocus = virtuosoScroller?.firstElementChild?.firstElementChild;
              } else {
                optionToFocus = optionsContainer?.firstElementChild;
              }
            }
            break;
          default:
            break;
        }
        (optionToFocus as HTMLElement)?.focus();
      }, 0);
    },
    [handleSelect, isVirtual, name],
  );

  useEffect(() => {
    window.removeEventListener('keydown', keyDownHandler);
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [keyDownHandler]);

  const optionsScrollListenerCallbackRef = useCallback(
    node => {
      if (node && rememberScrollPosition) {
        node.addEventListener('scroll', scrollListener, true);

        if (scrollPos.current) {
          node.scrollTop = scrollPos.current;
        }
      }
    },
    [rememberScrollPosition],
  );

  const closeIcons = (
    <>
      {handleClear && values.length > 0 && (
        <StyledCloseIconContainer
          onMouseDown={(e: React.FocusEvent) => e.stopPropagation()}
          onClick={handleClear}
          onFocus={(e: React.FocusEvent) => e.stopPropagation()}
          tabIndex={tabIndex}
          ref={closeIconRef}
          {...closeIconProps}
        >
          <Icon path={mdiClose} size="1em" />
        </StyledCloseIconContainer>
      )}
      <StyledArrowIconContainer ref={arrowIconRef} {...arrowIconProps}>
        <Icon path={isOpen ? mdiMenuUp : mdiMenuDown} size="1.25em" />
      </StyledArrowIconContainer>
    </>
  );

  const InternalOptionsContainer = useMemo(
    () =>
      React.forwardRef(({ children }: { children: React.ReactNode }, listRef) => (
        <StyledOptionsContainer
          color={defaultedColor}
          variant={optionsVariant}
          isVirtual={isVirtual}
          role="listbox"
          ref={mergeRefs([
            optionsContainerRef,
            optionsContainerInternalRef,
            listRef as React.RefObject<HTMLDivElement>,
          ])}
          isOpenedBelow={isOpenedBelow}
          isHidden={isHidden}
          {...optionsContainerProps}
        >
          {children}
        </StyledOptionsContainer>
      )),
    [
      defaultedColor,
      isHidden,
      isOpenedBelow,
      isVirtual,
      optionsContainerProps,
      optionsContainerRef,
      optionsVariant,
    ],
  );
  const handleSearchChange = useCallback(
    (e: any) => handleEventWithAnalytics('Dropdown', onSearchChange, 'onSearchChange', e, { name }),
    [handleEventWithAnalytics, onSearchChange, name],
  );

  const handleSearchDebouncedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleEventWithAnalytics('Dropdown', onDebouncedSearchChange, 'onDebouncedSearchChange', e, {
      name,
    });

    const searchText = e.target.value;

    setSearchCharacterCount(searchText.length);

    if (searchFiltersOptions) {
      if (searchText.length === 0) {
        setFilteredOptions(options);
      } else {
        const fuse = new Fuse(options, {
          keys: ['id', 'optionValue'],
        });

        const result = fuse.search(searchText);

        setFilteredOptions(result.map(r => r.item));
      }
    }
  };

  const optionsToRender = searchable && searchFiltersOptions ? filteredOptions : options;

  return (
    <StyledContainer
      id={`${name}-container`}
      elevation={elevation}
      isOpen={isOpen}
      onBlur={handleBlur}
      onFocus={handleFocus}
      name={name}
      aria-label={placeholder}
      ref={mergeRefs([containerRef, containerInternalRef])}
      {...containerProps}
    >
      <Button
        StyledContainer={StyledValueContainer}
        id={`${name}-dropdown-button`}
        color={defaultedColor}
        onMouseDown={handleMouseDownOnButton}
        variant={variant}
        containerRef={valueContainerRef}
        {...valueContainerProps}
        containerProps={{
          isOpen,
          isOpenedBelow,
          isHidden,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          ...(valueContainerProps ? valueContainerProps.containerProps : {}),
        }}
      >
        {searchCharacterCount === 0 && (!values || !values.length) && (
          <StyledPlaceholder
            ref={placeholderRef}
            id={`${name}-placeholder`}
            {...placeholderMergedProps}
          >
            {placeholder}
          </StyledPlaceholder>
        )}
        <StyledValueItem id={`${name}-value-item`} ref={valueItemRef} {...valueItemProps}>
          {values
            .filter(val => val !== undefined && optionsHash[val] !== undefined)
            .map((val, i, arr) =>
              optionsHash[val] !== undefined ? (
                <Tag
                  StyledContainer={StyledValueItemTagContainer}
                  variant={valueVariant}
                  containerRef={valueItemTagRef}
                  {...valueItemTagProps}
                  containerProps={{
                    dropdownVariant: variant,
                    tagVariant: valueVariant,
                    dropdownColor: defaultedColor,
                    transparentColor: colors.transparent,
                    ...(valueItemTagProps.containerProps || {}),
                  }}
                  key={val}
                >
                  {optionsHash[val].optionValue}
                  {valueVariant === variants.text && i !== arr.length - 1 && ','}
                </Tag>
              ) : undefined,
            )}
          {searchable && (
            <TextInput
              id={`${name}-search-input`}
              aria-label={`${name}-search-input`}
              onChange={handleSearchChange}
              debouncedOnChange={handleSearchDebouncedChange}
              StyledContainer={StyledSearchContainer}
              StyledInput={StyledSearchInput}
              inputRef={searchInputRef}
            />
          )}
        </StyledValueItem>
        {closeIcons}
      </Button>
      {isOpen && (
        <>
          {isVirtual ? (
            <Virtuoso
              data={optionsToRender}
              rangeChanged={(range: ListRange) => setScrollIndex(range.startIndex)}
              initialTopMostItemIndex={
                rememberScrollPosition && scrollIndex < optionsToRender.length ? scrollIndex : 0
              }
              components={
                {
                  Scroller: InternalOptionsContainer,
                } as Components
              }
              itemContent={(_index, option) => (
                <StyledOptionItem
                  id={`${name}-option-${option.id}`}
                  key={`${name}-option-${option.id}`}
                  onClick={() => handleSelect(option.id)}
                  tabIndex={-1}
                  color={defaultedColor}
                  variant={optionsVariant}
                  multi={multi}
                  selected={optionsHash[option.id].isSelected}
                  ref={optionItemRef}
                  role="option"
                  {...optionItemProps}
                >
                  {multi && (
                    <StyledCheckContainer
                      color={defaultedColor}
                      selected={optionsHash[option.id].isSelected}
                      variant={optionsVariant}
                      multi={multi}
                      ref={checkContainerRef}
                      {...checkContainerProps}
                    >
                      {optionsHash[option.id].isSelected && <Icon path={mdiCheck} size="1em" />}
                    </StyledCheckContainer>
                  )}
                  <Span>{option.optionValue}</Span>
                </StyledOptionItem>
              )}
            />
          ) : (
            <InternalOptionsContainer ref={optionsScrollListenerCallbackRef}>
              {optionsToRender.map(option => (
                <StyledOptionItem
                  id={`${name}-option-${option.id}`}
                  key={`${name}-option-${option.id}`}
                  onClick={() => handleSelect(option.id)}
                  tabIndex={-1}
                  color={defaultedColor}
                  variant={optionsVariant}
                  multi={multi}
                  selected={optionsHash[option.id].isSelected}
                  ref={optionItemRef}
                  role="option"
                  {...optionItemProps}
                >
                  {multi && (
                    <StyledCheckContainer
                      color={defaultedColor}
                      selected={optionsHash[option.id].isSelected}
                      variant={optionsVariant}
                      multi={multi}
                      ref={checkContainerRef}
                      {...checkContainerProps}
                    >
                      {optionsHash[option.id].isSelected && <Icon path={mdiCheck} size="1em" />}
                    </StyledCheckContainer>
                  )}
                  <Span>{option.optionValue}</Span>
                </StyledOptionItem>
              ))}
            </InternalOptionsContainer>
          )}
          {shouldStayInView && (
            <StyledHiddenOptionsContainer
              ref={mergeRefs([hiddenOptionsContainerInternalRef, hiddenOptionsContainerRef])}
              // HiddenOptionsContainer opens in the opposite direction of OptionsContainer
              isOpenedBelow={!isOpenedBelow}
            />
          )}
        </>
      )}
    </StyledContainer>
  );
};

Dropdown.Container = Container;
Dropdown.OptionsContainer = OptionsContainer;
Dropdown.HiddenOptionsContainer = HiddenOptionsContainer;
Dropdown.OptionItem = OptionItem;
Dropdown.ValueContainer = ValueContainer;
Dropdown.ValueItem = ValueItem;
Dropdown.ValueItemTagContainer = ValueItemTagContainer;
Dropdown.Placeholder = PlaceholderContainer;

export default Dropdown;
