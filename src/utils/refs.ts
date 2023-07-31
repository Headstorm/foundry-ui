import React from 'react';
/**
 * Merges multiple references
 * @param {Array} refs - Array of reference object or reference functions
 * @return {RefCallback} To apply each ref whether it is a ref object or ref callback
 */
export type MergeRefs<T> = Array<
  | React.RefObject<T>
  | React.MutableRefObject<T>
  | React.ForwardedRef<T>
  | React.RefCallback<T>
  | undefined
  | null
>;

export const mergeRefs = <T>(refs: MergeRefs<T>): ((inst: T) => void) => {
  const filteredRefs = refs.filter(Boolean);
  return (inst: T) => {
    filteredRefs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        (<React.MutableRefObject<T>>ref).current = inst;
      }
    });
  };
};
