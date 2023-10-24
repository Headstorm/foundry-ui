import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export const useStateWithPrevious = <Type>(
  defaultValue: Type,
): [Type, Type, React.Dispatch<Type>] => {
  const [currentValue, setInternalCurrentValue] = useState<Type>(defaultValue);
  const currentValueRef = useRef<Type>(defaultValue);
  const previous = useRef<Type>(defaultValue);

  useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  const setCurrent = (value: Type): void => {
    previous.current = currentValueRef.current;
    currentValueRef.current = value;
    setInternalCurrentValue(value);
  };

  return [currentValue, previous.current, setCurrent];
};

export type SizeObserverOptions = {
  target?: HTMLElement | Element;
};

export const useWindowSizeObserver = (
  reportInterval = 0, // only cause rerenders in the component using the hook every X milliseconds
  resizeEndReportDelay = 50, // wait this long after the last resize event to update curr/prev values
  options?: SizeObserverOptions,
): {
  width: number;
  height: number;
  previousWidth: number;
  previousHeight: number;
  isResizing: boolean;
} => {
  const [width, previousWidth, setWidth] = useStateWithPrevious(window.innerWidth);
  const [height, previousHeight, setHeight] = useStateWithPrevious(window.innerHeight);
  const [isResizing, setIsResizing] = useState(false);

  const { target } = options || { target: undefined };

  const recalculateBounds = useCallback(
    (targetForCalculation?: SizeObserverOptions['target']) => {
      if (targetForCalculation) {
        setWidth(targetForCalculation.clientWidth);
        setHeight(targetForCalculation.clientHeight);
      } else {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }
    },
    [setHeight, setWidth],
  );

  // if the resizing events stop for more than 100ms, set the previous widths/heights to the current
  // because this is based on async timing of debounce,
  // // the current/previous values will be delivered on the next render of the component using this hook.
  const debouncedEndResize = useCallback(
    () =>
      debounce(
        () => {
          recalculateBounds(target);
          setIsResizing(false);
        },
        resizeEndReportDelay,
        { leading: false, trailing: true },
      ),
    [recalculateBounds, resizeEndReportDelay, target],
  );

  const updateWindowBounds = useCallback(() => {
    recalculateBounds(target);

    if (!isResizing) {
      setIsResizing(true);
    }
    debouncedEndResize();
  }, [debouncedEndResize, isResizing, recalculateBounds, target]);

  const throttledResizeHandler = throttle(updateWindowBounds, reportInterval);

  useEffect(() => {
    window.addEventListener('resize', throttledResizeHandler);

    return () => {
      window.removeEventListener('resize', throttledResizeHandler);
    };
  }, [throttledResizeHandler]);

  return { width, height, previousWidth, previousHeight, isResizing };
};

export type ScrollObserverOptions = {
  target?: HTMLElement | Element;
};

export const useScrollObserver = (
  reportInterval = 0, // only cause rerenders in the component using the hook every X milliseconds
  scrollEndReportDelay = 50, // wait this long after the last resize event to update curr/prev values
  options?: ScrollObserverOptions,
): {
  scrollX: number;
  scrollY: number;
  previousScrollX: number;
  previousScrollY: number;
  isScrolling: boolean;
} => {
  const [scrollX, previousScrollX, setScrollX] = useStateWithPrevious(window.scrollX);
  const [scrollY, previousScrollY, setScrollY] = useStateWithPrevious(window.scrollY);
  const [isScrolling, setIsScrolling] = useState(false);

  // if the scrolling events stop for more than 100ms, set the previous X/Y to the current
  // because this is based on async timing of debounce,
  // // the current/previous values will be delivered on the next render of the component using this hook.
  const debouncedEndScroll = debounce(
    () => {
      if (options?.target) {
        setScrollX(options?.target.scrollLeft);
        setScrollY(options?.target.scrollTop);
      } else {
        setScrollX(window.scrollX);
        setScrollY(window.scrollY);
      }
      setIsScrolling(false);
    },
    scrollEndReportDelay,
    { leading: false, trailing: true },
  );

  const updateWindowBounds = useCallback(() => {
    if (options?.target) {
      setScrollX(options?.target.scrollLeft);
      setScrollY(options?.target.scrollTop);
    } else {
      setScrollX(window.scrollX);
      setScrollY(window.scrollY);
    }

    if (!isScrolling) {
      setIsScrolling(true);
    }
    debouncedEndScroll();
  }, [options?.target, isScrolling, debouncedEndScroll, setScrollX, setScrollY]);

  const throttledScrollHandler = throttle(updateWindowBounds, reportInterval);

  useEffect(() => {
    const finalTarget = options?.target ?? window;
    finalTarget.addEventListener('scroll', throttledScrollHandler);

    return () => {
      finalTarget.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [throttledScrollHandler, options?.target]);

  return { scrollX, scrollY, previousScrollX, previousScrollY, isScrolling };
};
