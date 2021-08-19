import React, { useContext } from 'react';
import styled from 'styled-components';
// import Device from 'react-device';
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

export const analyticsFunction = (
  componentType: string,
  eventType: string,
  eventArgs: React.ChangeEvent<HTMLInputElement>,
  currentURL: string,
  props: any,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  result.componentType = componentType;
  result.eventType = eventType;
  result.eventArgs = eventArgs;
  result.currentURL = currentURL;
  result.name = props.name;
  result.analytics = props.analytics;
  result.dateTime = new Date();

  return result;
};

type FoundryColorsType = Record<keyof typeof colorsEnum, string>;
type AnalyticsFunctionType = (
  componentType: string,
  eventType: string,
  eventArgs: React.ChangeEvent<HTMLInputElement>,
  currentURL: string,
  props: any,
) => Record<string, unknown>;

export type FoundryContextType = {
  globalStyles: string;
  colors: FoundryColorsType;
  analyticsFunction: AnalyticsFunctionType;
};

const defaultContextValue = {
  globalStyles: defaultGlobalStyles,
  colors: colorsEnum,
  analyticsFunction,
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
    analyticsFunction: AnalyticsFunctionType;
  };
  children: React.ReactNode;
}) => {
  const { globalStyles = defaultGlobalStyles, colors = colorsEnum } = value;

  // use the default set of styles, unless we've got something to override
  const mergedStyles =
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
      value={{ globalStyles: mergedStyles, colors: mergedColors, analyticsFunction }}
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

// export function getAnalytics(
//   componentType: string,
//   eventType: string,
//   eventArgs: Record<string, unknown>,
//   currentURL: string,
//   props: any,
// ): Record<string, unknown> {
//   const dateTime = new Date();

//   return [componentType, eventType, eventArgs, props.name, props.analytics, currentURL, dateTime];
// };

export function handleEventWithAnalytics(
  componentType: string,
  eventHandler: any,
  event: React.ChangeEvent<HTMLInputElement>,
  props: any,
): Record<string, unknown> {
  eventHandler(event);
  const res = analyticsFunction(componentType, event.type, event, 'TODO', props);
  console.log(res);
  return res;
}
