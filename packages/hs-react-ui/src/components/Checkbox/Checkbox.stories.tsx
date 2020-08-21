import React, { useState } from 'react';
import { select, text, boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import Checkbox, { CheckboxTypes } from './Checkbox';
import variants from '../../enums/variants';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A87',
};

storiesOf('Checkbox', module)
  .addParameters({ component: Checkbox })
  .add(
  'Default',
  () => {
    const [checked, setChecked] = useState(boolean('Checked', true));

    return (
      <Checkbox
        checkboxType={select('CheckboxType', CheckboxTypes, CheckboxTypes.check)}
        checked={checked}
        disabled={boolean('disabled', false)}
        onClick={() => setChecked(!checked)}
        variant={select('variant', variants, variants.outline)}
      >
        {text('Children', 'The label for the checkbox')}
      </Checkbox>
    );
  },
  { design, centered: true },
);
