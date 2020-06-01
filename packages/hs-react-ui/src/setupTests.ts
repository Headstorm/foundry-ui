/* eslint-disable */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// .toMatchDiffSnapshot()
// TODO - integrate with jest-styled-components, currently it does not make use of the
//  cleaner diffs
// import 'snapshot-diff/extend-expect';

// utilities for cleaner snapshot diffs with styled components and .toHaveStyleRule() for expect
import 'jest-styled-components';
