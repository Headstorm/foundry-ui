import styled from 'styled-components';
import { animated } from '@react-spring/web';
import { withGlobalStyle } from '../context';

// Use these elements over native styled.xx elements, as they apply
// sensible defaults for each element. If an element doesn't exist, add it to this block
export const StyledBaseDiv = withGlobalStyle(styled.div``);
export const StyledBaseSpan = withGlobalStyle(styled.span``);
export const StyledBaseButton = withGlobalStyle(styled.button``);
export const StyledBaseInput = withGlobalStyle(styled.input``);
export const StyledBaseLabel = withGlobalStyle(styled.label``);
export const StyledBaseHR = withGlobalStyle(styled.hr``);
export const StyledBaseTable = withGlobalStyle(styled.table``);
export const StyledBaseTH = withGlobalStyle(styled.th``);
export const StyledBaseTD = withGlobalStyle(styled.td``);
export const StyledBaseTR = withGlobalStyle(styled.tr``);
export const StyledBaseTextArea = withGlobalStyle(styled.textarea``);

export const AnimatedDiv = withGlobalStyle(styled(animated.div)``);
export const AnimatedSpan = withGlobalStyle(styled(animated.span)``);
