import React, { useContext } from 'react';
import styled, { css, StyledComponentBase } from 'styled-components';
import fonts from '../enums/fonts';

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

export type FoundryContextType = { globalStyles: string };
export const FoundryContext = React.createContext<FoundryContextType>({
  globalStyles: '',
  // TODO Add Foundry's "theme" to items here and pull from the ContextProvider
});

export const FoundryProvider = ({
  value,
  children,
}: {
  value: FoundryContextType;
  children: React.ReactNode;
}) => <FoundryContext.Provider value={value}>{children}</FoundryContext.Provider>;

export const withGlobalStyle = (Component: string & StyledComponentBase<any, {}>) => {
  const ComponentWithGlobalStyles = styled(Component)`
    ${props => props.globalStyles}
  `;

  return (props: any) => {
    const { globalStyles } = useContext(FoundryContext);
    const mergedGlobalStyles = `
      ${defaultGlobalStyles}
      ${globalStyles}
    `;
    return <ComponentWithGlobalStyles globalStyles={mergedGlobalStyles} {...props} />;
  };
};
