import styled, { StyledComponent } from 'styled-components';
import fonts from '../enums/fonts';

const withGlobalStyle = (Component: StyledComponent<any, any>) => styled(Component)`
  box-sizing: border-box;
  ${fonts.body}
`;

export const Div = withGlobalStyle(styled.div``);
export const Span = withGlobalStyle(styled.span``);
export const Button = withGlobalStyle(styled.button``);
export const Input = withGlobalStyle(styled.input``);
export const Label = withGlobalStyle(styled.label``);
export const HR = withGlobalStyle(styled.hr``);
export const Table = withGlobalStyle(styled.table``);
export const TH = withGlobalStyle(styled.th``);
export const TD = withGlobalStyle(styled.td``);
export const TR = withGlobalStyle(styled.tr``);
