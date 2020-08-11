import React, { useState } from 'react';
import { select, text, boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import Checkbox, { CheckboxTypes } from './Checkbox';

const design = {
  type: 'figma',
  url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Generic-UI-Style?node-id=102%3A87',
};

storiesOf('Checkbox', module)
  .addParameters({ component: Checkbox })
  .add(
    'Default',
    () => {
      const [checked, setChecked] = useState(boolean('Checked', false));

      return (
        <Checkbox
          checkboxType={select('CheckboxType', CheckboxTypes, CheckboxTypes.check)}
          checked={checked}
          onClick={() => setChecked(!checked)}
        >
          {text('Children', 'The label for the checkbox')}
        </Checkbox>
      );
    },
    { design, centered: true },
  );
