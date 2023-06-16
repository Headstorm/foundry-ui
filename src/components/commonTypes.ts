import { StyledComponentBase } from 'styled-components';

export type SubcomponentPropsType = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StyledSubcomponentType = React.FC | ((props: any) => JSX.Element) | StyledComponent;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StyledComponent = string & StyledComponentBase<any, SubcomponentPropsType>;
