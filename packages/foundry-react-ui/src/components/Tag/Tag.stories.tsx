import React from 'react';
import { select, text, boolean, number, color } from '@storybook/addon-knobs';
import { mdiMessage, mdiSend } from '@mdi/js';
import { storiesOf } from '@storybook/react';

import Tag from './Tag';
import colors from '../../enums/colors';
import variants from '../../enums/variants';

const options = {
  none: '',
  mdiMessage,
  mdiSend,
};

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=0%3A1',
};

const testId = `tag-${Math.floor(Math.random() * 100000)}`;
const containerProps = { 'data-test-id': testId };

storiesOf('Tag', module)
  .addParameters({ component: Tag })
  .add(
    'Basic Tag',
    () => {
      return (
        <Tag
          variant={select('variant', variants, variants.fill)}
          color={color('color', colors.primaryDark)}
          isLoading={boolean('isLoading', false)}
          elevation={number('elevation', 1)}
          isProcessing={boolean('isProcessing', false)}
          iconPrefix={select('iconPrefix', options, options.none)}
          iconSuffix={select('iconSuffix', options, options.none)}
          containerProps={containerProps}
        >
          {text('children', 'Default text')}
        </Tag>
      );
    },
    { design },
  );
