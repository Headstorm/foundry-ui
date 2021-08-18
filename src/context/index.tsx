import React, { useContext } from 'react';
import styled from 'styled-components';
import fonts from '../enums/fonts';
import colorsEnum from '../enums/colors';
import { StyledSubcomponentType } from '../components/commonTypes';

export const defaultGlobalStyles = `
  ${
    process.env.NODE_ENV === 'test'
      ? ''
      : `
          box-sizing: border-box;
          ${fonts.body}
        `
  }
`;
type FoundryColorsType = Record<keyof typeof colorsEnum, string>;
export type FoundryContextType = {
  globalStyles: string;
  colors: FoundryColorsType;
  styleConstants: { [key in string]: number | string };
};

const defaultContextValue = {
  globalStyles: defaultGlobalStyles,
  colors: colorsEnum,
  styleConstants: {},
  // TODO Add Foundry's "theme" to items here and pull from the ContextProvider
};

export const FoundryContext = React.createContext<FoundryContextType>(defaultContextValue);

export const FoundryProvider = ({
  value = defaultContextValue,
  children,
}: {
  value?: {
    globalStyles?: string;
    colors?: Partial<Record<keyof typeof colorsEnum, string>>;
    styleConstants?: {};
  };
  children: React.ReactNode;
}) => {
  const { globalStyles = defaultGlobalStyles, colors = colorsEnum, styleConstants = {} } = value;

  // use the default set of styles, unless we've got something to override
  const mergedGlobalStyles =
    globalStyles === defaultGlobalStyles
      ? globalStyles
      : `
    ${defaultGlobalStyles}
    ${globalStyles}
  `;
  const mergedColors = {
    ...colorsEnum,
    ...colors,
  };

  return (
    <FoundryContext.Provider
      value={{
        globalStyles: mergedGlobalStyles,
        colors: mergedColors,
        styleConstants,
      }}
    >
      {children}
    </FoundryContext.Provider>
  );
};

export function useTheme(): FoundryContextType {
  const theme = useContext(FoundryContext);
  return theme;
}

export const withGlobalStyle = (Component: StyledSubcomponentType) => {
  const ComponentWithGlobalStyles = styled(Component)`
    ${props => {
      return props.globalStyles;
    }}
  `;

  return React.forwardRef((props: any, ref: any) => {
    const { globalStyles } = useContext(FoundryContext);
    return <ComponentWithGlobalStyles globalStyles={globalStyles} {...props} ref={ref} />;
  });
};
