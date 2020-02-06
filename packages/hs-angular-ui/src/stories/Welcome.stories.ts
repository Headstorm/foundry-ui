import { ButtonComponent } from '../app/button/button.component';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, select, text } from '@storybook/addon-knobs';

export default {
  decorators: [withA11y, withKnobs],
  title: 'Button'
}

export const button = () => ({
  component: ButtonComponent,
  props: {
    text: text('text', 'Click me!'),
    type: select('Button Type', ['primary', 'default', 'destructive'], 'primary')
  },
});