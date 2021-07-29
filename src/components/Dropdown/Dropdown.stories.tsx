import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';
import { boolean, color, number, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { address } from 'faker';
import Icon from '@mdi/react';
import { mdiLeaf } from '@mdi/js';

import Dropdown, { OptionProps } from './Dropdown';
import variants from '../../enums/variants';
import Label from '../Label';
import { colors } from '../../index';

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
  .addParameters({ component: Dropdown })
  .add(
    'Basic',
    () => {
      const [values, setValues] = useState<(string | number)[] | undefined>();
      return (
        <>
          <Label labelText="City" htmlFor="cities-list">
            <Dropdown
              color={color('color', colors.primaryDark)}
              elevation={number('elevation', 0, { range: true, min: -5, max: 5, step: 1 })}
              multi={boolean('multi', false)}
              name="cities-list"
              placeholder={text('placeholder', 'Choose a city...')}
              onBlur={action('onBlur')}
              onFocus={action('onFocus')}
              onClear={boolean('clearable', false) ? action('onClear') : undefined}
              onSelect={(selected?: Array<string | number>) => {
                action('onSelect')();
                setValues(selected);
              }}
              options={cities}
              rememberScrollPosition={boolean('rememberScrollPosition', true)}
              variant={select('variant', variants, variants.fill)}
              optionsVariant={select('optionsVariant', variants, variants.outline)}
              valueVariant={select('valueVariant', variants, variants.text)}
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
      const [values, setValues] = useState<(string | number)[] | undefined>();
      return (
        <>
          <Label labelText="How strong do you like your tea?" htmlFor="tea-rank">
            <Dropdown
              color="#0A7700"
              elevation={number('elevation', 1, { range: true, min: 0, max: 5, step: 1 })}
              multi={boolean('multi', false)}
              name="tea-rank"
              onSelect={(selected?: (string | number)[]) => {
                action('onSelect')();
                setValues(selected);
              }}
              options={teaOptions}
              variant={select('variant', variants, variants.fill)}
              values={values}
            />
          </Label>
        </>
      );
    },
    { design },
  );
