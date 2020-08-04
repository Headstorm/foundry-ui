import React, { useContext } from 'react';
import styled, { StyledComponentBase } from 'styled-components';
import fonts from '../enums/fonts';
import colorsEnum from '../enums/colors';

export const defaultGlobalStyles = `
  ${
    process && process.env && process.env.NODE_ENV === 'test'
      ? ''
      : `
          box-sizing: border-box;
          ${fonts.importFonts}
          ${fonts.body}
        `
  }

`;
type FoundryColorsType = Record<keyof typeof colorsEnum, string>;
export type FoundryContextType = {
  globalStyles: string;
  colors: FoundryColorsType;
};
export const FoundryContext = React.createContext<FoundryContextType>({
  globalStyles: '',
  colors: colorsEnum,
  // TODO Add Foundry's "theme" to items here and pull from the ContextProvider
});

export const FoundryProvider = ({
  value,
  children,
}: {
  value: { globalStyles?: string; colors: Partial<Record<keyof typeof colorsEnum, string>> };
  children: React.ReactNode;
}) => {
  const { globalStyles = '', colors = colorsEnum } = value;
  const mergedGlobalStyles = `
    ${defaultGlobalStyles}
    ${globalStyles}
  `;
  const mergedColors = {
    ...colorsEnum,
    ...colors,
  };
  return (
    <FoundryContext.Provider value={{ globalStyles: mergedGlobalStyles, colors: mergedColors }}>
      {children}
    </FoundryContext.Provider>
  );
};

type validColor = keyof typeof colorsEnum;
export function isValidColor(color: string, colors: FoundryColorsType): color is validColor {
  return color in colors;
}

export function useColors<T extends validColor>(color: T): string;
export function useColors<T extends Array<keyof typeof colorsEnum>>(
  colors: T,
): Record<T[0], string>;
export function useColors(): FoundryColorsType;
export function useColors(param?: validColor | Array<validColor>) {
  const { colors } = useContext(FoundryContext);
  if (typeof param === 'string' && isValidColor(param, colors)) {
    return colors[param];
  }
  if (Array.isArray(param)) {
    return param.reduce((acc, p) => ({ ...acc, [p]: colors[p] }), {});
  }
  if (!param) {
    return colors;
  }
}

export const withGlobalStyle = (Component: string & StyledComponentBase<any, {}>) => {
  const ComponentWithGlobalStyles = styled(Component)`
    ${props => props.globalStyles}
  `;

  return (props: any) => {
    const { globalStyles } = useContext(FoundryContext);
    return <ComponentWithGlobalStyles globalStyles={globalStyles} {...props} />;
  };
};
