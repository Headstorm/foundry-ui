<div align="center"><img src="./docs/images/foundry-ui.png" width="600"></img></div>

<div align='center'>The only open-source UI library that's made to be remade</div>
##Intro

Foundry-UI (or Foundry for short) is a great choice for your next software project's __user interface (UI)__, because Foundry was created to:

* Support enterprise applications at any stage, from proof-of-concept to launch to enhancements
* Allow custom styling and behavior of indvidual components with Foundry’s unique architecture
* Reach users on any device for any use case while maintaining full functionality and accessibilty

Foundry is developed and powered by Headstorm's Open Source group, but you can help out, too. Please reach out to us at __opensource@headstorm.com__ —we'd love to hear your feedback. If you would like to contribute please the see __Contributing__ section below for more information.

At of the time this writing, Foundry is brand-new and launching with a fully supported React version, while the Angular version still a work in progress — don't hesitate to reach out to contribute on the Angular version. To go directly to one of the README of each library, use the following links.

##Foundry for React
📄 [README](https://github.com/Headstorm/rasa-ui/tree/master/packages/hs-react-ui) 🔥 [Live Demo](https://headstorm.github.io/rasa-ui/) 

<img src="./docs/images/nodejs.svg" height="50" style="margin-right: 5em">
<img src="./docs/images/react.svg" height="50" style="margin-right: 5em">
<img src="./docs/images/typescript.svg" height="50" style="margin-right: 5em">
<img src="./docs/images/storybook.png" height="50">




![npm](https://img.shields.io/npm/dw/@headstorm/hs-react-ui)
[![NPM](https://img.shields.io/npm/v/@headstorm/hs-react-ui.svg)](https://www.npmjs.com/package/@headstorm/hs-react-ui) 
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@headstorm/hs-react-ui)
![open source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4%EF%B8%8F%20-red)
![NPM](https://img.shields.io/npm/l/@headstorm/hs-react-ui)
[![coverage](coveralls/:vcsType/:user/:hs-/:master)](/packages/hs-ui-react/:vcsType/:user/:hs-/:master)

##Foundry for Angular
📄 [README](https://github.com/Headstorm/rasa-ui/tree/master/packages/hs-angular-ui)

Coming soon. If you would like to contribute please the see __Contributing__ section below for more information.

![open source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4%EF%B8%8F%20-red)
![NPM](https://img.shields.io/npm/l/@headstorm/hs-angular-ui)

##Getting Started

###Prerequisites
Foundry is a [React](https://reactjs.org) based user-interface library and therefore must be added to an existing web project that is running React version 15.0.0 over higher.  

If you're new to React or web development, no problem! There are other great open-source tools out there that will have you creating gleaming web apps in a reasonably short amount of time. If you haven't already, set up a new React project--a great place to start is [create-react-app](https://create-react-app.dev/docs/getting-started). 

###Install Foundry-UI into a React app

Foundry for React is available as a scoped public Node package. You can use [npm](https://docs.npmjs.com/) or [yarn](https://classic.yarnpkg.com/en/docs) to add the Foundry package to your project. From you project's root directory, where the `package.json` file is located, run the npm command:

```
npm install @headstorm/hs-react-ui
```

or yarn command:

```
yarn add @headstorm/hs-react-ui
```

Please note that the [styled components](https://styled-components.com/) package is a peer dependency. Install styled-components from the same root directory, run the npm command:

```
npm install --save styled-components
```
or yarn command:

```
yarn add styled-components
```


##Usage

```
import React, { useState } from 'react';
import styled from 'styled-components';
import { mdiAccountCircleOutline } from '@mdi/js';
import { Card, Button, Divider, Label, Text, TextInput, colors } from '@headstorm/hs-react-ui'; 

// Adjusting the style of the footer to help position the buttons added
const StyledFooter = styled(Card.Footer)`
  display: flex;
  justify-content: space-between;
`;

const StyledBody = styled(Card.Body)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  row-gap: 1.5rem;
`;

function Demo() {
    const [state, setState] = useState({firstName: 'Cecilia', lastName: 'Beaux'});
    const [isSaving, setIsSaving] = useState(false);
    const [savedState, setSavedState] = useState(state);

    const onSave = () => {
        const newSavedState = { ...state };
        setIsSaving(true);
  
        // Use a setTimeout to simulate a network call
        setTimeout(() => {
          setSavedState(newSavedState);
          setIsSaving(false);
        }, 1000);
      };

    const saveButton = (
      <Button
        key="saveButton"
        onClick={onSave}
        color={colors.primaryDark}
        isProcessing={isSaving}
        type={Button.ButtonTypes.submit}
      >
        {isSaving ? 'Saving' : 'Save'}
      </Button>
    );

    const Header = (
      <>
        <Text key="headerText" iconPrefix={mdiAccountCircleOutline}>
          Edit Your Profile
        </Text>
        <Divider width="100%" />
      </>
    );

    const StyledSavedName = (
        <Text color={colors.grayLight} >Saved: {savedState.firstName} {savedState.lastName}</Text>
    );
    return (
      <>
        <Card
          elevation={1}
          header={Header}
          footer={[StyledSavedName, saveButton]}
          StyledFooter={StyledFooter}
          StyledBody={StyledBody}
        >
          <Label
            labelText="First Name"
            htmlFor="firstName"
            isValid={state.firstName !== ''}
            isRequired
            key="firstName"
          >
            <TextInput
              onChange={(e)=>{setState({...state, firstName: e.target.value})}}
              value={state.firstName}
              isValid={typeof state.firstName !== 'undefined' && state.firstName.length > 0}
              errorMessage="First Name cannot be blank"
              id="firstName"
            />
          </Label>

          <Label labelText="Last Name" htmlFor="lastName" key="lastName">
            <TextInput
              onChange={(e)=>{setState({...state, lastName: e.target.value})}}
              value={state.lastName}
              id="lastName"
            />
          </Label>
        </Card>
      </>
    );
  };
export default Demo;
```

## Contributing

Find the project board which you want to contribute to. Currently there are two project boards for each front-end library included in hs-ui:

- [rasa-react-ui project board](https://github.com/Headstorm/rasa-ui/projects/1)
- [rasa-angular-ui project board](https://github.com/Headstorm/rasa-ui/projects/2)

As well as a board for overarching issues that don't belong to either package.

- [rasa-ui project board](https://github.com/Headstorm/rasa-ui/projects/3)

Once you're on the board for your library of choice, pick a ticket from the `Priority to do` swim-lane. **Fork and clone** the repository and create a branch for your ticket, with the ticket number prefixing the name of the ticket (i.e. `4-publish-package-to-npm`). When making commits, be sure to prefix your commit messages with the ticket number, like so: `#4 Updating package.json to make the package public`. Once you've made a commit it should automatically be moved to the `In progress` swim-lane, and then moved to `Needs review` once a PR is made.
