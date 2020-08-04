import React from 'react';
import { StyledComponentBase } from 'styled-components';
import { SubcomponentPropType } from '../commonTypes';

export type ExpansionIconProps = {
  isCollapsed: boolean;
  onClick: any;
};
export type InternalExpansionIconProps = {
  isCollapsed: boolean;
  groupHeaderPosition: 'above' | 'below';
  onClick: any;
};

export interface columnTypes {
  [index: string]: {
    name?: string;
    width?: string;
    minTableWidth?: number;
    sortable?: boolean;
    sortFunction?: Function;
    isGroupLabel?: boolean;
    cellComponent?: any;
    rowComponent?: any;
    headerCellComponent?: any;
    groupCellComponent?: any;
  };
}

export type TableProps = {
  areGroupsCollapsible?: boolean;
  columnGap?: string;
  columns: columnTypes;
  data?: columnTypes[] | Array<Array<columnTypes>>;
  defaultSort?: [string, boolean]; // key, direction
  groupHeaderPosition?: 'above' | 'below';
  expansionIconComponent?: React.FunctionComponent<InternalExpansionIconProps>;
  minWidthBreakpoint?: number;
  sortGroups?: boolean;

  StyledCell?: string & StyledComponentBase<any, {}>;
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledGroupLabelRow?: string & StyledComponentBase<any, {}>;
  StyledHeader?: string & StyledComponentBase<any, {}>;
  StyledHeaderCell?: string & StyledComponentBase<any, {}>;
  StyledRow?: string & StyledComponentBase<any, {}>;
  cellProps?: SubcomponentPropType;
  containerProps?: SubcomponentPropType;
  groupLabelRowProps?: SubcomponentPropType;
  headerProps?: SubcomponentPropType;
  headerCellProps?: SubcomponentPropType;
  rowProps?: SubcomponentPropType;
};
export type RowProps = {
  columnGap: string;
  columnWidths: string;
  rowNum?: number;
  reachedMinWidth?: boolean;
  isCollapsed?: boolean;
}; /* Types and Interfaces */
export type CellOptions = {
  RenderedCell: any;
  headerColumnKey: string;
  breakPointHit: boolean;
  row: columnTypes;
  index: number;
  indexModifier?: number;
  CollapseExpandedIcon?: any;
  groupIndex?: number;
  isCollapsed?: boolean;
  groupLabelDataString?: string;
  cellProps?: SubcomponentPropType;
};
