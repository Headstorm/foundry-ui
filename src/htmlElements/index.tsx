import styled from 'styled-components';
import { animated } from '@react-spring/web';
import { withGlobalStyle } from '../context';

// Use these elements over native styled.xx elements, as they apply
// sensible defaults for each element. If an element doesn't exist, add it to this block
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
export const TextArea = withGlobalStyle(styled.textarea``);

export const AnimatedDiv = withGlobalStyle(styled(animated.div)``);
export const AnimatedSpan = withGlobalStyle(styled(animated.span)``);
