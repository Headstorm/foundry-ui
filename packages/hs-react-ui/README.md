[![CircleCI](https://circleci.com/gh/Headstorm/rasa-ui/tree/master.svg?style=shield)](https://circleci.com/gh/Headstorm/rasa-ui/tree/master) [![NPM](https://img.shields.io/npm/v/@headstorm/hs-react-ui.svg)](https://www.npmjs.com/package/@headstorm/hs-react-ui)

# Rasa React UI

Rasa UI is lovingly developed by Headstorm's Open Source group. Please reach out to us at: opensource@headstorm.com

# Previewing components in Storybook

## [🔥 Live Documentation/Component Viewer](https://headstorm.github.io/rasa-ui/)

## Locally

Run `yarn install` to install the dependencies, then you can run `yarn start` to start the storybook server.
The app will automatically reload if you change any of the source files.

## Running unit tests

Run `yarn test` to execute the unit tests via Jest.

# Theming components

HS-UI is themeable on many levels and allows you to customize as little or as much as you want. Gone are the days of having to use deep CSS selectors with `!important` on every style.

## Basics

Each base component is built from at least one styled-component. When theming each component, it is highly recommended that you open the source for the base component so that you know all of the styles currently applied.

For example, the Card component has 4 (at the time of writing) styled-components which make up the entire component. It has a container, header, body, and footer. There are many levels of customization you can apply to the Card:

- Color scheme, animation timings, and other constants
  - Completely replace the `colors` and `timings` constants objects, so that existing styled-components will use your theme without any other intervention.
  - Import the built-in constants, spread them at the top of your new constants object, and then override only the constants you want to change.
  - NOTE: This feature has not yet been completed, see [Issue #15](https://github.com/Headstorm/rasa-ui/issues/15) to follow the progress.
- Replace a portion of a base component with your own styled-component
  - While the `Card` `Header` is a `styled.div` with `text-transform: uppercase`, you can pass in any styled component to replace the header entirely, it could even be a `styled.span` if you want! Create your styled-component and then pass it to the StyledHeader prop of the `Card` and voilà! It doesn't use any of the previous styles that were originally created for the Card Header.
  - You'll have access to all the props which are passed to the styled-component as well. In the case of Card, the `elevation` prop is passed directly into the Container, so while a Material Design theme may use it to programatically control the `box-shadow` and `border` property, you can use it for anything you wish.
- Add CSS/SASS overrides to a portion of a base component
  - This almost the same as the previous method, except that you'll first import the piece you're overriding from the original base component. In the case of the Card Header, you'll `import Card, { Header } from 'hs-react-ui/Card;`, and then use that as your base as so: `` styled(Header)`styles go here` ``. You'll have the full power of styled-components, and you can include your constants files as you like.
  - Again, the `styled(Header)` will receive the same props that the original did, giving you full control of how to handle the props in the style.

# Contributing

Pick a ticket from the `Priority to do` swim-lane of the [project board](https://github.com/Headstorm/rasa-ui/projects/1). **Fork and clone** the repository and create a branch for your ticket, with the ticket number prefixing the name of the ticket (i.e. `4-publish-package-to-npm`). When making commits, be sure to prefix your commit messages with the ticket number, like so: `#4 Updating package.json to make the package public`. Once you've made a commit it should automatically be moved to the `In progress` swim-lane, and then moved to `Needs review` once a PR is made. For commits to be included in the changelog you muse use formatted commit messages. We've made this easier to do by adding a script for committing messages, simply use `npm run commit` or `yarn commit` to create your changelog commits.

## Notes on architecture

We use custom HTML elements in place of the built in styled-components elements.
These elements have a set of sensible default styles that we wish to apply to all elements. This means:

```jsx
// don't do this
import styled from 'styled-components';
const MyContainer = styled.div`styles`;

// do this
import styled from 'styled-components';
import { Div } from 'path/to/htmlElements';
const MyContainer = styled(Div)`styles here`;
```

## Creating new components

### Enabling Theming

Theming is enabled through props of each component. When building a new component, or adding a styled-component to an existing component, ensure that there is a matching prop to accept an override, and that styled-component is a named export from the component. See the [Card component](https://github.com/Headstorm/rasa-ui/tree/master/packages/hs-react-ui/src/components/Card) as an example.
