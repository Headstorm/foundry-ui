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
  eventArgs: React.ChangeEvent<HTMLInputElement>,
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
  name: props.name,
  analytics: props.analytics,
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
};

const defaultContextValue = {
  globalStyles: defaultGlobalStyles,
  colors: colorsEnum,
  analyticsFunction: defaultAnalyticsFunction,
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
  };
  children: React.ReactNode;
}) => {
  const {
    globalStyles = defaultGlobalStyles,
    colors = colorsEnum,
    analyticsFunction = defaultAnalyticsFunction,
  } = value;

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
  const mergedAnalytics =
    defaultAnalyticsFunction === analyticsFunction ? defaultAnalyticsFunction : analyticsFunction;

  return (
    <FoundryContext.Provider
      value={{
        globalStyles: mergedStyles,
        colors: mergedColors,
        analyticsFunction: mergedAnalytics,
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

// export function useAnalytics(): AnalyticsFunctionType {
//   const analytics = useContext(FoundryContext).analyticsFunction;
//   return analytics;
// }

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

export const useEventWithAnalytics = () => {
  const context = useContext(FoundryContext);
  return (
    componentType: string,
    eventHandler: any,
    eventType: string,
    event: any,
    props: any,
  ): void => {
    eventHandler(event);
    const dateTime = new Date();
    const deviceInfo: Record<string, unknown> = rdd.deviceDetect();
    deviceInfo.innerHeight = window.innerHeight;
    deviceInfo.innerWidth = window.innerWidth;

    const res = context.analyticsFunction(
      componentType,
      eventType,
      event,
      dateTime,
      deviceInfo,
      window.location.href,
      props,
    );
    console.log(res);
  };
};
