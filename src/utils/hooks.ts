import React, { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
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
