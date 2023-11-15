import Button from './components/Button';
import Card from './components/Card';
import Checkbox from './components/Checkbox';
import Divider from './components/Divider';
import Dropdown from './components/Dropdown';
import InteractionFeedback from './components/InteractionFeedback';
import Label from './components/Label';
import Modal from './components/Modal';
import RangeSlider from './components/RangeSlider';
import Spotlight from './components/Spotlight';
import Table from './components/Table';
import Tag from './components/Tag';
import Text from './components/Text';
import TextInput from './components/TextInput';
import Toggle from './components/Toggle';
import Progress from './components/Progress';
import Skeleton from './components/Skeleton';
import Avatar from './components/Avatar';
import { FoundryProvider, FoundryContext, useTheme, withGlobalStyle } from './context';
import { useStateWithPrevious, useWindowSizeObserver, useScrollObserver } from './utils/hooks';
import { clamp } from './utils/math';
import { getShadowStyle, calculateElevationValues, getDropdownTagStyle } from './utils/styles';

import {
  StyledBaseDiv,
  StyledBaseSpan,
  StyledBaseButton,
  StyledBaseInput,
  StyledBaseLabel,
  StyledBaseHR,
  StyledBaseTable,
  StyledBaseTH,
  StyledBaseTD,
  StyledBaseTR,
  StyledBaseTextArea,
} from './htmlElements';

import colors from './enums/colors';
import timings from './enums/timings';
import fonts from './enums/fonts';
import variants from './enums/variants';
import feedbackTypes from './enums/feedbackTypes';
import checkboxTypes from './enums/checkboxTypes';
import {
  disabledStyles,
  getBackgroundColorFromVariant,
  getFontColorFromVariant,
} from './utils/color';
import { useReducedMotion } from './utils/a11y';

export {
  // Globally styled base elements
  StyledBaseDiv,
  StyledBaseSpan,
  StyledBaseButton,
  StyledBaseInput,
  StyledBaseLabel,
  StyledBaseHR,
  StyledBaseTable,
  StyledBaseTH,
  StyledBaseTD,
  StyledBaseTR,
  StyledBaseTextArea,
  withGlobalStyle,
  // Components
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  Dropdown,
  InteractionFeedback,
  Label,
  Modal,
  RangeSlider,
  Skeleton,
  Spotlight,
  Table,
  Tag,
  Text,
  TextInput,
  Toggle,
  FoundryProvider,
  FoundryContext,
  // Utils and helpers
  useTheme,
  clamp,
  getFontColorFromVariant,
  getBackgroundColorFromVariant,
  getShadowStyle,
  calculateElevationValues,
  getDropdownTagStyle,
  disabledStyles,
  useStateWithPrevious,
  useWindowSizeObserver,
  useScrollObserver,
  useReducedMotion,
  // Defaults
  colors,
  timings,
  fonts,
  // Enums and types
  variants,
  feedbackTypes,
  checkboxTypes,
  // deprecated exports
  /** @deprecated The Progress loading skeleton is being replaced by the Skeleton component */
  Progress,
};
