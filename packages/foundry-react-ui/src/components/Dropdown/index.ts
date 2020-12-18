import Dropdown, {
  objectOrArrayToDropdownOptions as objToOptions,
  OptionProps as DropdownOptionProps,
} from './Dropdown';

export type OptionProps = DropdownOptionProps; // I'd give a nickel to know why this had to be done.
export default Dropdown;
export const objectOrArrayToDropdownOptions = objToOptions;
