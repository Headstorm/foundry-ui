import React from 'react';
import Icon from '@mdi/react';

export type ExpansionIconProps = {
  collapsedIcon: string;
  expandedIcon: string;
  isCollapsed: boolean;
  groupHeaderPosition: 'above' | 'below';
  onClick: any;
};

const onKeyPress = (evt: React.KeyboardEvent<HTMLSpanElement>) => {
  if (evt.key === 'Enter' || evt.key === ' ') {
    evt.preventDefault();
    (evt.target as any).click();
  }
};

const ExpansionIcon: React.FunctionComponent<ExpansionIconProps> = ({
  collapsedIcon,
  expandedIcon,
  isCollapsed,
  onClick,
}: ExpansionIconProps) => {
  const path = isCollapsed ? collapsedIcon : expandedIcon;
  return (
    <span tabIndex={0} onClick={onClick} role="button" onKeyPress={onKeyPress}>
      <Icon path={path} size="1rem" />
    </span>
  );
};

export default ExpansionIcon;
