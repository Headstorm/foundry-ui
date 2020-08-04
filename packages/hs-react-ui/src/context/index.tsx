import React, { useContext } from 'react';
import styled, { css, StyledComponentBase } from 'styled-components';
import fonts from '../enums/fonts';
import colorsEnum from '../enums/colors';

export const defaultGlobalStyles = `
  ${
    process.env.NODE_ENV !== 'test'
      ? css`
          box-sizing: border-box;
          ${fonts.importFonts}
          ${fonts.body}
        `
      : ''
  }

`;

export type FoundryContextType = {
  globalStyles: string;
  colors: Record<keyof typeof colorsEnum, string>;
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
  value: { globalStyles?: string, colors: Partial<Record<keyof typeof colorsEnum, string>>}
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

export const withGlobalStyle = (Component: string & StyledComponentBase<any, {}>) => {
  const ComponentWithGlobalStyles = styled(Component)`
    ${props => props.globalStyles}
  `;

  return (props: any) => {
    const { globalStyles } = useContext(FoundryContext);
    return <ComponentWithGlobalStyles globalStyles={globalStyles} {...props} />;
  };
};
