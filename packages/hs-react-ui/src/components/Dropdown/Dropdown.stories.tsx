import React from 'react';

import { storiesOf } from '@storybook/react';
import { boolean, color, number, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { address } from 'faker';

import Button from '../Button';
import Dropdown, { OptionProps } from './Dropdown';
import colors from '../../enums/colors';
import Label from '../Label';
import { useState } from '@storybook/addons';
import { mdiLeaf } from '@mdi/js';
import Icon from '@mdi/react';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A28',
};

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

storiesOf('Dropdown', module)
  .add(
    'Basic',
    () => {
      const storyValue = select(
        'values',
        cities.map(f => f.id),
        cities[0].id,
      );
      const [values, setValues] = useState([storyValue]);
      return (
        <>
          <Label labelText="City" htmlFor="cities-list">
            <Dropdown
              color={color('color', undefined)}
              elevation={number('elevation', 0, { range: true, min: 0, max: 5, step: 1 })}
              multi={boolean('multi', false)}
              name="cities-list"
              onBlur={action('onBlur')}
              onClear={boolean('clearable', false) ? action('onClear') : undefined}
              onSelect={newVals => {
                action('onSelect')();
                setValues(newVals);
              }}
              options={cities}
              variant={select('variant', Button.ButtonVariants, Button.ButtonVariants.outline)}
              values={values}
            />
          </Label>
        </>
      );
    },
    { design },
  )
  .add(
    'Icons',
    () => {
      const [values, setValues] = useState();
      return (
        <>
          <Label labelText="How strong do you like your tea?" htmlFor="tea-rank">
            <Dropdown
              color="#0A7700"
              elevation={number('elevation', 1, { range: true, min: 0, max: 5, step: 1 })}
              multi={boolean('multi', false)}
              name="tea-rank"
              onSelect={newVals => {
                action('onSelect')();
                setValues(newVals);
              }}
              options={teaOptions}
              variant={select('variant', Button.ButtonVariants, Button.ButtonVariants.fill)}
              values={values}
            />
          </Label>
        </>
      );
    },
    { design },
  );
