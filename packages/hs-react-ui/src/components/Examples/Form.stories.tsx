import React, { useState, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { name, address, internet, company, phone, commerce, date } from 'faker';
import TextInput from '../TextInput';
import Button from '../Button';
import Card from '../Card';
import Checkbox from '../Checkbox';
import Divider from '../Divider';
import Dropdown from '../Dropdown';
import Modal from '../Modal';
import Text from '../Text';
import Label from '../Label';
import Table from '../Table';
import colors from '../../enums/colors';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=0%3A1',
};

const stateAbbreviations = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA',
  'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT',
  'VT','VA','WA','WV','WI','WY'
 ];

const defaultState = {
  firstName: name.firstName(),
  lastName: name.lastName(),
  title: name.title(),
  city: address.city(),
  streetAddress: address.streetAddress(),
  state: address.stateAbbr(),
  birthday: date.between("1/1/1950", "12/31/2000"),
  phone: phone.phoneNumber(),
  email: internet.email(),
  company: company.companyName(),
  department: commerce.department(),
  notifications: false,
};

const StyledFooter = styled(Card.Footer)`
  display: flex;
  justify-content: space-between;
`;

storiesOf('Form Example', module).add(
  'Controlled Form',
  () => {
    const [state, setState] = useState(defaultState);
    const [isSaving, setIsSaving] = useState(false);
    const [savedState, setSavedState] = useState(defaultState);

    // This is not the best way to handle this, but will work for the current example
    // By creating a callback function like this, we will create a new callback for each
    // handler on every render, which is not the ideal scenario. To prevent this,
    // use the useCallback helper.
    const createCallback = (property: string): (event: any) => void => {
      return (event) => {
        setState(Object.assign({}, state, {[property]: event.target.value}));
      }
    }

    const onSave = () => {
      const newSavedState = Object.assign({}, state);
      setIsSaving(true);
      setTimeout(() => {
        setSavedState(newSavedState);
        setIsSaving(false);
      }, Math.random() * 500);
    }

    const onReset = () => {
      setState(Object.assign({}, savedState));
    }

    const saveButton = (
      <Button
        key={"saveButton"}
        onClick={onSave}
        type={Button.ButtonTypes.outline}
        isProcessing={isSaving}
      >
        Save
      </Button>
    );

    const cancelButton = (
      <Button
        key={"cancelButton"}
        onClick={onReset}
        color={colors.grayXlight}
      >
        Cancel
      </Button>
    );

    const actionButtons = [];
    actionButtons.push()
    return (
      <Card
        header={`${savedState.firstName}'s Profile`}
        footer={[cancelButton, saveButton]}
        StyledFooter={StyledFooter}
      >
        <Label
          labelText="First Name"
          htmlFor="firstName"
          isRequired
          isValid={state.firstName.length > 0}
          key="firstName"
        >
          <TextInput
            onChange={createCallback("firstName")}
            value={state.firstName}
            isValid={state.firstName.length > 0}
            errorMessage="First Name cannot be blank"
            id="firstName"
          />
        </Label>

        <Label
          labelText="Last Name"
          htmlFor="lastName"
          isRequired
          isValid={state.lastName.length > 0}
          key="lastName"
        >
          <TextInput
            onChange={createCallback("lastName")}
            value={state.lastName}
            isValid={state.lastName.length > 0}
            errorMessage="Last Name cannot be blank"
            id="lastName"
          />
        </Label>

        <Label
          labelText="Title"
          htmlFor="title"
          isRequired
          isValid={state.title.length > 0}
          key="title"
        >
          <TextInput
            onChange={createCallback("title")}
            value={state.title}
            isValid={state.title.length > 0}
            errorMessage="Title cannot be blank"
            id="title"
          />
        </Label>

        <Label
          labelText="Company"
          htmlFor="company"
          isValid={state.company.length > 0}
          key="company"
        >
          <TextInput
            onChange={createCallback("company")}
            value={state.company}
            id="company"
          />
        </Label>

        <Label
          labelText="Street Address"
          htmlFor="streetAddress"
          isRequired
          isValid={state.streetAddress.length > 0}
          key="streetAddress"
        >
          <TextInput
            onChange={createCallback("streetAddress")}
            value={state.streetAddress}
            isValid={state.streetAddress.length > 0}
            errorMessage="Street Address cannot be blank"
            id="streetAddress"
          />
        </Label>

        <Label
          labelText="State"
          htmlFor="state"
          isRequired
          isValid={state.state.length > 0}
          key="state"
        >
          <Dropdown
            options={stateAbbreviations}
          />
        </Label>
      </Card>
    );
  },
  { design },
);
