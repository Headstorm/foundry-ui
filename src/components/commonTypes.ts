import { StyledComponentBase } from 'styled-components';

export type SubcomponentPropsType = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export type StyledSubcomponentType<O extends object = {}> =
  | (string & StyledComponentBase<any, SubcomponentPropsType, O>)
  | ((props: any) => JSX.Element)
  | React.FC;
