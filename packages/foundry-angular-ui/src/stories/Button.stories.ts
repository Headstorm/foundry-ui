import { ButtonComponent } from '../components/button/button.component';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, select, text } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs';

export default {
  decorators: [withA11y, withDesign, withKnobs],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3r2G00brulOwr9j7F6JF59/Button?node-id=0%3A1'
    }
  },
  title: 'Button'
};

export const button = () => ({
  component: ButtonComponent,
  props: {
    onClick: () => alert('touché!'),
    text: text('text', 'Click me!'),
    type: select('Button Type', ['primary', 'default', 'destructive'], 'primary')
  },
});
