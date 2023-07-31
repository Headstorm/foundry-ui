import React from 'react';
import { mergeRefs } from '../refs';
import { render } from '@testing-library/react';

describe('util refs', () => {
  describe('mergeRefs', () => {
    class RefCallBack {
      ref = null;

      refCB = element => {
        this.ref = element;
      };
    }
    const refFn = new RefCallBack();
    const refObj = React.createRef<HTMLDivElement>();

    it('Should apply ref object', async () => {
      render(<div ref={mergeRefs<HTMLDivElement>([refObj])} />);
      expect(refObj.current).toBeTruthy();
      expect(refObj.current instanceof HTMLDivElement).toBeTruthy();
    });

    it('Should apply ref callback', async () => {
      render(<span ref={mergeRefs<any | RefCallBack>([refFn.refCB])} />);
      expect((refFn.ref as any) instanceof HTMLSpanElement).toBeTruthy();
    });

    it('Should apply multiple refs', async () => {
      render(<div ref={mergeRefs<unknown | RefCallBack>([refObj, refFn.refCB])} />);
      expect((refFn.ref as any) instanceof HTMLDivElement).toBeTruthy();
      expect(refObj.current instanceof HTMLDivElement).toBeTruthy();
      expect(refObj.current).toEqual(refFn.ref);
    });
  });
});
