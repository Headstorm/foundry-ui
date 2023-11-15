import { StyledComponentBase } from 'styled-components';

export type SubcomponentPropsType = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export type StyledSubcomponentType<P = any> =
  | StyledComponentBase<any, any>
  | ((props: P) => JSX.Element)
  | React.FC<P>;
