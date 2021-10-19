import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import Icon from '@mdi/react';
import * as Icons from '@mdi/js';
import colors from '../../enums/colors';
// import { Main } from '../../htmlElements';
import MainNavigation, { MainNavigationProps } from './MainNavigation';
import Text from '../Text';
import TextInput from '../TextInput';
import Button from '../Button';

type DefaultProps = MainNavigationProps;

const App = styled.div`
  outline: 1px grey solid;
`;

const HeaderText = styled(Text.Container)`
  white-space: nowrap;
`;

const HamburgerButton = styled(Button.Container)`
  height: 100%;
  padding: 0.5rem;
  margin-right: 1rem;
  &:focus {
    box-shadow: 0 0 0;
  }
`;

const SearchBar = styled(TextInput.Container)`
  ${({ expanded }: { expanded: boolean }) => `
    width: ${expanded ? '99%' : '80%'};
    margin-left: auto;
    margin-right: ${expanded ? 'auto' : '1rem'};
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    &:focus-within {
      outline: none;
      box-shadow: 0 0 5px 0.15rem ${colors.tertiary};
    }
  `}
`;

const SearchInput = styled(TextInput.Input)`
  &:focus {
    box-shadow: 0 0 0;
  }
`;

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua. Porttitor massa id neque aliquam vestibulum morbi
blandit cursus risus. Mi bibendum neque egestas congue quisque egestas diam. Pulvinar
sapien et ligula ullamcorper. Ac turpis egestas integer eget aliquet nibh. Bibendum at
varius vel pharetra vel turpis nunc eget. Interdum varius sit amet mattis vulputate enim
nulla aliquet porttitor. Morbi tempus iaculis urna id volutpat. Auctor neque vitae tempus
quam pellentesque. Tempor commodo ullamcorper a lacus vestibulum sed. Malesuada proin
libero nunc consequat interdum varius. At volutpat diam ut venenatis tellus in metus
vulputate eu. Quam adipiscing vitae proin sagittis nisl. Sagittis purus sit amet volutpat
consequat. Magna fringilla urna porttitor rhoncus dolor. Vitae aliquet nec ullamcorper sit
amet. Imperdiet dui accumsan sit amet nulla facilisi. Sapien faucibus et molestie ac
feugiat sed lectus vestibulum. Sed tempus urna et pharetra pharetra. Ut placerat orci
nulla pellentesque dignissim enim sit amet. Netus et malesuada fames ac turpis egestas
integer. Bibendum est ultricies integer quis auctor elit sed. Et netus et malesuada fames
ac turpis. Ultrices sagittis orci a scelerisque purus semper eget duis at. Non blandit
massa enim nec dui nunc. Felis bibendum ut tristique et egestas quis. Volutpat ac
tincidunt vitae semper. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna.
Donec enim diam vulputate ut pharetra sit amet aliquam. Quis enim lobortis scelerisque
fermentum dui faucibus in ornare quam. Suspendisse sed nisi lacus sed viverra tellus in.
Proin nibh nisl condimentum id venenatis. Duis tristique sollicitudin nibh sit amet
commodo nulla. Sed cras ornare arcu dui. Consectetur adipiscing elit pellentesque habitant
morbi tristique senectus et netus. Ut etiam sit amet nisl purus in mollis nunc. Aliquam id
diam maecenas ultricies mi eget mauris pharetra et. Neque volutpat ac tincidunt vitae
semper quis lectus. Amet nisl suscipit adipiscing bibendum. Ultrices sagittis orci a
scelerisque purus. Et malesuada fames ac turpis egestas sed tempus. Euismod lacinia at
quis risus sed vulputate. Egestas fringilla phasellus faucibus scelerisque eleifend donec.
Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque purus. Nunc
lobortis mattis aliquam faucibus purus in massa tempor. Euismod nisi porta lorem mollis
aliquam. Varius vel pharetra vel turpis nunc eget lorem dolor sed. Tempus urna et pharetra
pharetra massa massa ultricies mi quis. Aliquam faucibus purus in massa. Pellentesque sit
amet porttitor eget dolor. Sit amet cursus sit amet dictum sit amet. Adipiscing elit ut
aliquam purus sit. Velit ut tortor pretium viverra suspendisse. Aliquet nibh praesent
tristique magna sit amet purus gravida. Risus pretium quam vulputate dignissim suspendisse
in est ante. Nulla pharetra diam sit amet nisl suscipit adipiscing bibendum est. Tristique
et egestas quis ipsum suspendisse ultrices gravida. Aliquam ut porttitor leo a diam. Quis
hendrerit dolor magna eget est lorem. Sed tempus urna et pharetra pharetra massa massa
ultricies mi. Venenatis urna cursus eget nunc scelerisque viverra mauris. Sed egestas
egestas fringilla phasellus faucibus scelerisque eleifend. Venenatis tellus in metus
vulputate eu. Parturient montes nascetur ridiculus mus. Id diam vel quam elementum
pulvinar etiam. Magna etiam tempor orci eu.`;

const getIconPath = (path: string, color: string) =>
  path ? <Icon color={color} size="1rem" path={path} /> : undefined;

export const Default: Story<DefaultProps> = ({ ...args }: DefaultProps) => {
  const [hidden, setHidden] = React.useState(args.hidden);
  React.useEffect(() => setHidden(args.hidden), [args.hidden]);
  const [expanded, setExpanded] = React.useState(args.bodyBelow);
  React.useEffect(() => setExpanded(args.bodyBelow), [args.bodyBelow]);
  const [active, setActive] = React.useState(0);

  const getScrollSpeed = MainNavigation.getScrollSpeed(50);

  return (
    <App>
      <MainNavigation
        hidden={hidden}
        hideBody={args.hideBody && !expanded}
        hiddenBelowY={args.hiddenBelowY}
        bodyBelow={expanded}
        onScroll={() => {
          action(`Scrolled with speed: ${Math.abs(getScrollSpeed())}`)();
        }}
        position={args.position}
        location={args.location}
        color={args.color}
        height={args.height}
        header={args.header}
        body={
          <TextInput
            placeholder="Search Bar"
            StyledContainer={SearchBar}
            containerProps={{ expanded }}
            StyledInput={SearchInput}
            iconPrefix={getIconPath(Icons.mdiMagnify, 'grey')}
          />
        }
        navButtons={[
          {
            label: 'Link 1',
            onClick: () => {
              setActive(0);
              action('click 1')();
            },
          },
          {
            label: 'Link 2',
            onClick: () => {
              setActive(1);
              action('click 2')();
            },
          },
          {
            label: 'Link 3',
            onClick: () => {
              setActive(2);
              action('click 3')();
            },
          },
        ]}
        activeButton={active}
        labelFontSize={args.labelFontSize}
        footer={
          <Button
            color="#0000"
            StyledContainer={HamburgerButton}
            onClick={() => setExpanded(!expanded)}
          >
            {getIconPath(Icons.mdiMenu, 'white')}
          </Button>
        }
      />
      <body>
        <h2>
          <Text>Lorem ipsum</Text>
        </h2>
        <Text>{lorem.repeat(10)}</Text>
      </body>
    </App>
  );
};
Default.args = {
  hidden: false,
  hiddenBelowY: 100,
  hideBody: false,
  bodyBelow: false,
  color: colors.primaryDark,
  height: 'fit-content',
  header: (
    <Text StyledContainer={HeaderText} color="#fff">
      Foundry UI
    </Text>
  ),
  labelFontSize: '.75rem',
  position: 'relative',
};

export default {
  title: 'MainNavigation',
  component: MainNavigation,
  argTypes: {
    position: {
      options: ['relative', 'sticky', 'fixed', 'static'],
      control: {
        type: 'select',
      },
    },
  },
  parameters: {},
} as Meta;
