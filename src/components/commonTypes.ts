import { StyledComponentBase } from 'styled-components';

export type SubcomponentPropsType = Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StyledSubcomponentType = string & StyledComponentBase<any, SubcomponentPropsType>;
