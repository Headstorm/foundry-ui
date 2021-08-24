import React, { useContext } from 'react';
import styled from 'styled-components';
import * as rdd from 'react-device-detect';
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

export const defaultAnalyticsFunction = (
  componentType: string,
  eventType: string,
  eventArgs: any,
  dateTime: Date,
  deviceInfo: Record<string, unknown>,
  currentURL: string,
  props?: any,
): Record<string, unknown> => ({
  componentType,
  eventType,
  eventArgs,
  dateTime,
  deviceInfo,
  currentURL,
  name: 'name' in props ? props.name : 'No name provided',
  analytics: 'analytics' in props ? props.analytics : 'No analytics object provided',
});

type FoundryColorsType = Record<keyof typeof colorsEnum, string>;
type AnalyticsFunctionType = (
  componentType: string,
  eventType: string,
  eventArgs: React.ChangeEvent<HTMLInputElement>,
  dateTime: Date,
  deviceInfo: Record<string, unknown>,
  currentURL: string,
  props?: any,
) => any;

export type FoundryContextType = {
  globalStyles: string;
  colors: FoundryColorsType;
  analyticsFunction: AnalyticsFunctionType;
  styleConstants: { [key in string]: number | string };
};

const defaultContextValue = {
  globalStyles: defaultGlobalStyles,
  colors: colorsEnum,
  analyticsFunction: defaultAnalyticsFunction,
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
    analyticsFunction?: AnalyticsFunctionType;
    styleConstants?: {};
  };
  children: React.ReactNode;
}) => {
  const {
    globalStyles = defaultGlobalStyles,
    colors = colorsEnum,
    styleConstants = {},
    analyticsFunction = defaultAnalyticsFunction,
  } = value;

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
  const mergedAnalytics =
    defaultAnalyticsFunction === analyticsFunction ? defaultAnalyticsFunction : analyticsFunction;

  return (
    <FoundryContext.Provider
      value={{
        globalStyles: mergedGlobalStyles,
        colors: mergedColors,
        analyticsFunction: mergedAnalytics,
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

export const useAnalytics = () => {
  const context = useContext(FoundryContext);
  return (
    componentType: string,
    eventFunction: any,
    eventType: string,
    eventArgs: any,
    props: any,
  ): void => {
    eventFunction(eventArgs);
    const dateTime = new Date();
    const deviceInfo: Record<string, unknown> = rdd.deviceDetect();
    deviceInfo.innerHeight =
      typeof window !== 'undefined'
        ? window.innerHeight
        : 'Server Side Rendering Requires the analytics function to handle window dimensions';
    deviceInfo.innerWidth =
      typeof window !== 'undefined'
        ? window.innerWidth
        : 'Server Side Rendering Requires the analytics function to handle window dimensions';

    const currURL =
      typeof window !== 'undefined'
        ? window.location.href
        : 'Server Side Rendering Requires the analytics function to handle window URL';

    context.analyticsFunction(
      componentType,
      eventType,
      eventArgs,
      dateTime,
      deviceInfo,
      currURL,
      props,
    );
  };
};
