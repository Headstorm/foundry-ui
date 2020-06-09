import styled, { keyframes, css } from 'styled-components';
import { Div } from '../../boilerplate';

/* Keyframes for the loading bar gradient */
export const movingGradient = keyframes`
  0% { background-position: 200% bottom; }
  100% { background-position: 0% bottom; }
`;

/* Animation to scroll the gradient toward the right */
export const animation = css`
  ${movingGradient} 8s linear infinite;
`;

/* Styled div that represents the scroll bar
   Note: The border-radius 9999px is used to create a pill shape */
const Progress = styled(Div)`
  ${() => css`
    background: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.75),
        rgba(0, 0, 0, 0.75),
        rgba(255, 255, 255, 0.75),
        rgba(0, 0, 0, 0.75),
        rgba(255, 255, 255, 0.75)
      )
      repeat;
    background-size: 400% 100%;
    width: 6rem;
    height: 16px;
    border-radius: 9999px;
    animation: ${animation};
    line-height: 0;
  `}
`;

export default Progress;
