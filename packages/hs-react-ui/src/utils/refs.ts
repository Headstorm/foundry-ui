/* eslint-disable import/prefer-default-export */

export const mergeRefs = (
  ...refs: Array<React.MutableRefObject<any> | ((inst: any) => void) | undefined>
): null | ((inst: any) => void) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  // if (filteredRefs.length === 0) return filteredRefs[0];
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
