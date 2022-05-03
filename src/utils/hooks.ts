import { debounce, throttle } from 'lodash';
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

export const useWindowSize = (
  reportInterval: number = 0, // only cause rerenders in the component using the hook every X milliseconds
  resizeEndReportDelay: number = 50, // wait this long after the last resize event to update curr/prev values
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

  // if the resizing events stop for more than 100ms, set the previous widths/heights to the current
  // because this is based on async timing of debounce,
  // // the current/previous values will be delivered on the next render of the component using this hook.
  const debouncedEndResize = debounce(
    () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setIsResizing(false);
    },
    resizeEndReportDelay,
    { leading: false, trailing: true },
  );

  const updateWindowBounds = useCallback(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    if (!isResizing) {
      setIsResizing(true);
    }
    debouncedEndResize();
  }, [debouncedEndResize, isResizing, setHeight, setWidth]);

  const throttledResizeHandler = throttle(updateWindowBounds, reportInterval);

  useEffect(() => {
    window.addEventListener('resize', throttledResizeHandler);

    return () => {
      window.removeEventListener('resize', throttledResizeHandler);
    };
  }, [throttledResizeHandler]);

  return { width, height, previousWidth, previousHeight, isResizing };
};
