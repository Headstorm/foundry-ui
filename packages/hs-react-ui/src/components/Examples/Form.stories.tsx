import React, { useState } from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { mdiAccountCircleOutline, mdiRefresh } from '@mdi/js';
import { name, address, internet, company, phone, commerce, lorem } from 'faker';
import TextInput from '../TextInput';
import Button from '../Button';
import Card from '../Card';
import Checkbox from '../Checkbox';
import Divider from '../Divider';
import Dropdown from '../Dropdown';
import Modal from '../Modal';
import Text from '../Text';
import Label from '../Label';
import colors from '../../enums/colors';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=0%3A1',
};

// All 50 + DC
const stateAbbreviations = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

interface state {
  firstName: string;
  lastName: string;
  title: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  company: string;
  department: string;
  notifications: boolean;
  bio: string;
  age: number;
}

const defaultState: state = {
  firstName: name.firstName(),
  lastName: name.lastName(),
  title: name.title(),
  city: address.city(),
  state: address.stateAbbr(),
  phone: phone.phoneNumber(),
  age: Math.ceil(Math.random() * 50 + 18),
  email: internet.email(),
  company: company.companyName(),
  department: commerce.department(),
  notifications: false,
  bio: lorem.paragraph(5),
};

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

const ResetButtonContainer = styled(Button.Container)`
  margin-right: 1.5rem;
`;

storiesOf('Form Example', module).add(
  'Controlled Form',
  () => {
    const [state, setState] = useState(defaultState);
    const [isSaving, setIsSaving] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [savedState, setSavedState] = useState(defaultState);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // By creating a callback function like this, we will create a new callback for each
    // handler on every render, which is not the ideal scenario for maximum performance.
    // To prevent this, use the useCallback helper. We're  doing this to shorten the length
    // of the example's source code.
    const createTextInputCallback = (property: string): ((event: any) => void) => {
      return event => {
        setState({ ...state, [property]: event.target.value });
      };
    };

    const onSave = () => {
      const newSavedState = { ...state };
      setIsSaving(true);

      // Use a setTimeout to simulate a network call
      setTimeout(() => {
        setSavedState(newSavedState);
        setIsSaving(false);
      }, 4000);
    };

    const onReset = () => {
      setIsResetting(true);
      setIsModalOpen(false);

      // Simulate network call
      setTimeout(() => {
        setIsResetting(false);
        setState({ ...savedState });
      }, Math.random() * 1000 + 500);
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };

    const openModal = () => {
      setIsModalOpen(true);
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

    const cancelButton = (
      <Button
        key="cancelButton"
        onClick={openModal}
        color={colors.destructive}
        isProcessing={isResetting}
        variant={Button.ButtonVariants.text}
      >
        Reset
      </Button>
    );

    const confirmButton = (
      <Button
        key="confirmButton"
        onClick={onReset}
        color={colors.destructive}
        iconPrefix={mdiRefresh}
        type={Button.ButtonTypes.reset}
      >
        Reset form
      </Button>
    );

    const abortButton = (
      <Button
        key="cancelButton"
        onClick={closeModal}
        color={colors.destructive}
        variant={Button.ButtonVariants.text}
        StyledContainer={ResetButtonContainer}
        type={Button.ButtonTypes.button}
      >
        Go back
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

    return (
      <>
        <Card
          elevation={1}
          header={Header}
          footer={[cancelButton, saveButton]}
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
              onChange={createTextInputCallback('firstName')}
              value={state.firstName}
              isValid={typeof state.firstName !== 'undefined' && state.firstName.length > 0}
              errorMessage="First Name cannot be blank"
              id="firstName"
            />
          </Label>

          <Label labelText="Last Name" htmlFor="lastName" key="lastName">
            <TextInput
              onChange={createTextInputCallback('lastName')}
              value={state.lastName}
              id="lastName"
            />
          </Label>

          <Label
            labelText="Age"
            htmlFor="age"
            isRequired
            isValid={!!state.age && +state.age > 13}
            key="age"
          >
            <TextInput
              onChange={createTextInputCallback('age')}
              value={`${state.age}`}
              errorMessage="Must be 13+"
              isValid={!!state.age && +state.age > 13}
              id="age"
              type="number"
            />
          </Label>

          <Label
            labelText="Bio"
            htmlFor="bio"
            key="bio"
            isRequired
            isValid={!!state.bio && state.bio.length > 30}
          >
            <TextInput
              onChange={createTextInputCallback('bio')}
              value={state.bio}
              id="bio"
              isValid={!!state.bio && state.bio.length > 30}
              errorMessage="Write a little more"
              isMultiline
              rows={3}
              cols={25}
            />
          </Label>

          <Label labelText="Title" htmlFor="title" key="title">
            <TextInput onChange={createTextInputCallback('title')} value={state.title} id="title" />
          </Label>

          <Label labelText="Company" htmlFor="company" key="company">
            <TextInput
              onChange={createTextInputCallback('company')}
              value={state.company}
              id="company"
            />
          </Label>

          <Label labelText="City" htmlFor="city" key="city">
            <TextInput onChange={createTextInputCallback('city')} value={state.city} id="city" />
          </Label>

          <Label labelText="State" htmlFor="state" key="state">
            <Dropdown
              name="state-dropdown"
              options={stateAbbreviations}
              color={colors.primaryDark}
              values={[state.state as string]}
              onSelect={val => {
                setState({ ...state, state: val as string });
              }}
            />
          </Label>

          <Label labelText="Notifications" htmlFor="notifications" key="notifications">
            <Checkbox
              onClick={() => {
                setState({ ...state, notifications: !state.notifications });
              }}
              checked={state.notifications}
              checkboxType={Checkbox.Types.check}
            >
              {state.notifications ? 'Enabled' : 'Disabled'}
            </Checkbox>
          </Label>
        </Card>
        {isModalOpen && (
          <Modal onClose={closeModal} onClickOutside={closeModal} backgroundDarkness={0.5}>
            <Card
              elevation={1}
              header="Would you like to continue?"
              footer={[abortButton, confirmButton]}
            >
              You will lose any unsaved changes, are you sure you would like to reset?
            </Card>
          </Modal>
        )}
      </>
    );
  },
  { design },
);
