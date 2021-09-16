import { StyledComponentBase } from 'styled-components';

export type SubcomponentPropsType = Record<string, unknown>;
export type StyledSubcomponentType = string & StyledComponentBase<any, SubcomponentPropsType>;
