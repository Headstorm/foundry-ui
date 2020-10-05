/* eslint-disable import/prefer-default-export */
import React from 'react';
/**
 * Merges multiple references
 * @param {Array} refs - Array of reference object or reference functions
 * @return {RefCallback} To apply each ref whether it is a ref object or ref callback
 */
export type MergeRefs = Array<React.MutableRefObject<any> | React.RefCallback<any> | undefined>;

export const mergeRefs = (refs: MergeRefs): null | React.RefCallback<any> => {
  if (!(refs instanceof Array)) return null;
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  return inst => {
    filteredRefs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        // eslint-disable-next-line no-param-reassign
        ref.current = inst;
      }
    });
  };
};
