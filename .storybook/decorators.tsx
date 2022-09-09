import React from 'react';
import { FoundryProvider } from '../src/context';

export const withFoundryContext = Story => (
  <FoundryProvider>
    <Story />
  </FoundryProvider>
);
