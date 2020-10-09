import { FunctionComponent, MouseEventHandler } from 'react';
import { StyledComponentBase } from 'styled-components';
import { SubcomponentPropsType } from '../commonTypes';

export type ExpansionIconProps = {
  isCollapsed: boolean;
  onClick: MouseEventHandler;
};
export type InternalExpansionIconProps = {
  isCollapsed: boolean;
  groupHeaderPosition: 'above' | 'below';
  onClick: MouseEventHandler;
};

export interface columnTypes {
  [index: string]: {
    name?: string;
    width?: string;
    minTableWidth?: number;
    sortable?: boolean;
    sortFunction?: Function;
    isGroupLabel?: boolean;
    cellComponent?: string & StyledComponentBase<any, {}>;
    rowComponent?: string & StyledComponentBase<any, {}>;
    headerCellComponent?: string & StyledComponentBase<any, {}>;
    groupCellComponent?: string & StyledComponentBase<any, {}>;
  };
}

export type TableProps = {
  areGroupsCollapsible?: boolean;
  columnGap?: string;
  columns: columnTypes;
  data?: columnTypes[] | Array<Array<columnTypes>>;
  defaultSort?: [string, boolean]; // key, direction
  groupHeaderPosition?: 'above' | 'below';
  expansionIconComponent?: FunctionComponent<InternalExpansionIconProps>;
  minWidthBreakpoint?: number;
  sortGroups?: boolean;

  StyledCell?: string & StyledComponentBase<any, {}>;
  StyledContainer?: string & StyledComponentBase<any, {}>;
  StyledGroupLabelRow?: string & StyledComponentBase<any, {}>;
  StyledHeader?: string & StyledComponentBase<any, {}>;
  StyledHeaderCell?: string & StyledComponentBase<any, {}>;
  StyledRow?: string & StyledComponentBase<any, {}>;
  cellProps?: SubcomponentPropsType;
  containerProps?: SubcomponentPropsType;
  groupLabelRowProps?: SubcomponentPropsType;
  headerProps?: SubcomponentPropsType;
  headerCellProps?: SubcomponentPropsType;
  rowProps?: SubcomponentPropsType;
};
export type RowProps = {
  columnGap: string;
  columnWidths: string;
  rowNum?: number;
  reachedMinWidth?: boolean;
  isCollapsed?: boolean;
};
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
  cellProps?: SubcomponentPropsType;
};
