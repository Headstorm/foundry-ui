/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import styled from 'styled-components';
import * as rdd from 'react-device-detect';

import { useReducedMotion } from '../utils/a11y';
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

export type FoundryColorsType = Record<keyof typeof colorsEnum, string>;
export type AnalyticsFunctionType = (
  componentType: string,
  eventType: string,
  eventArgs: React.ChangeEvent<HTMLInputElement>,
  dateTime: Date,
  deviceInfo: Record<string, unknown>,
  currentURL: string,
  props?: any,
) => any;

export type AccessibilityPreferences = {
  // TODO: Add to this
  prefersReducedMotion: boolean;
};

export const defaultAnalyticsFunction: AnalyticsFunctionType = (
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

export const defaultAccessibilityPreferences: AccessibilityPreferences = {
  prefersReducedMotion: true,
};

export type FoundryContextType = {
  globalStyles: string;
  colors: FoundryColorsType;
  analyticsFunction: AnalyticsFunctionType;
  accessibilityPreferences: AccessibilityPreferences;
  styleConstants: { [key in string]: number | string };
};

const defaultContextValue = {
  globalStyles: defaultGlobalStyles,
  colors: colorsEnum,
  accessibilityPreferences: defaultAccessibilityPreferences,
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
}): JSX.Element => {
  const {
    globalStyles = defaultGlobalStyles,
    colors = colorsEnum,
    styleConstants = {},
    analyticsFunction = defaultAnalyticsFunction,
  } = value;

  const prefersReducedMotion = useReducedMotion();

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
        analyticsFunction,
        accessibilityPreferences: { prefersReducedMotion },
        styleConstants,
      }}
    >
      {children}
    </FoundryContext.Provider>
  );
};

export const useTheme = (): FoundryContextType => {
  const theme = useContext(FoundryContext);
  return theme;
};

export const useColors = (): FoundryColorsType => {
  const { colors } = useContext(FoundryContext);
  return colors;
};

export const useAccessibilityPreferences = (): AccessibilityPreferences => {
  const { accessibilityPreferences } = useContext(FoundryContext);
  return accessibilityPreferences;
};

export const withGlobalStyle = (
  Component: StyledSubcomponentType,
): React.ForwardRefExoticComponent<any> => {
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

export const useAnalytics = (): ((
  componentType: string,
  eventFunction: any,
  eventType: string,
  eventArgs: any,
  props: any,
) => void) => {
  const context = useContext(FoundryContext);
  return (
    componentType: string,
    eventFunction: any,
    eventType: string,
    eventArgs: any,
    props: any,
  ): void => {
    if (eventFunction !== undefined) {
      eventFunction(eventArgs);
    }
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
