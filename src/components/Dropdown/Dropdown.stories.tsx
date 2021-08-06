import React, { useState } from 'react';

import { Story, Meta } from '@storybook/react';
import { address } from 'faker';
import Icon from '@mdi/react';
import { mdiLeaf } from '@mdi/js';

import Dropdown, { DropdownProps, OptionProps } from './Dropdown';
import variants from '../../enums/variants';
import Label from '../Label';
import { colors } from '../../index';

const generateCityList = (amount: number): OptionProps[] => {
  const finalData = [];

  for (let i = 0; i < amount; i += 1) {
    const item = address.city();
    finalData.push({
      id: item.toLowerCase(),
      optionValue: item,
    });
  }

  return finalData;
};
const cities = generateCityList(50);

type BasicProps = DropdownProps & { clearable: boolean };

export const Basic: Story<BasicProps> = ({ clearable, onClear, onSelect, ...args }: BasicProps) => {
  const [values, setValues] = useState<(string | number)[] | undefined>();

  return (
    <Label labelText="City" htmlFor="cities-list">
      <Dropdown
        {...args}
        name="cities-list"
        onClear={clearable ? onClear : undefined}
        onSelect={(selected?: Array<string | number>) => {
          setValues(selected);
          return onSelect();
        }}
        options={cities}
        values={values}
      />
    </Label>
  );
};
Basic.args = {
  color: colors.primaryDark,
  elevation: 0,
  multi: false,
  placeholder: 'Choose a city...',
  clearable: false,
  rememberScrollPosition: true,
  variant: variants.fill,
  optionsVariant: variants.outline,
  valueVariant: variants.text,
};

const teaOptions = [
  {
    id: 0,
    optionValue: "I don't like tea.",
  },
  {
    id: 1,
    optionValue: <Icon key="0" size="1em" path={mdiLeaf} />,
  },
  {
    id: 2,
    optionValue: (
      <>
        <Icon key="0" size="1em" path={mdiLeaf} />
        <Icon key="1" size="1em" path={mdiLeaf} />
      </>
    ),
  },
  {
    id: 3,
    optionValue: (
      <>
        <Icon key="0" size="1em" path={mdiLeaf} />
        <Icon key="1" size="1em" path={mdiLeaf} />
        <Icon key="2" size="1em" path={mdiLeaf} />
      </>
    ),
  },
  {
    id: 4,
    optionValue: (
      <>
        <Icon key="0" size="1em" path={mdiLeaf} />
        <Icon key="1" size="1em" path={mdiLeaf} />
        <Icon key="2" size="1em" path={mdiLeaf} />
        <Icon key="3" size="1em" path={mdiLeaf} />
      </>
    ),
  },
];

export const Icons: Story = args => {
  const [values, setValues] = useState<(string | number)[] | undefined>();
  return (
    <Label labelText="How strong do you like your tea?" htmlFor="tea-rank">
      <Dropdown
        {...args}
        name="tea-rank"
        onSelect={(selected?: Array<string | number>) => {
          setValues(selected);
          return args.onSelect();
        }}
        options={teaOptions}
        values={values}
      />
    </Label>
  );
};
Icons.args = {
  ...Basic.args,
  color: '#0A7700',
  elevation: 1,
};

export default {
  title: 'Dropdown',
  component: Dropdown,
  argTypes: {
    elevation: { control: { type: 'range', min: -5, max: 5, step: 1 } },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A28',
    },
  },
} as Meta;
