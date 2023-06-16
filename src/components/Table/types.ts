import React, { FunctionComponent, MouseEventHandler, ReactNode } from 'react';
import { SubcomponentPropsType, StyledSubcomponentType } from '../commonTypes';

export type ExpansionIconProps = {
  isCollapsed: boolean;
  onClick: MouseEventHandler;
};
export type InternalExpansionIconProps = {
  isCollapsed: boolean;
  groupHeaderPosition: 'above' | 'below';
  onClick: MouseEventHandler;
};

export interface Columns {
  [index: string]: Column;
}

export interface Column {
  name?: string;
  width?: string;
  minTableWidth?: number;
  sortable?: boolean;
  footerContent?: ReactNode;
  sortFunction?: (item1: any, item2: any) => boolean;
  isGroupLabel?: boolean;
  cellComponent?: ComponentBuilder;
  rowComponent?: ComponentBuilder;
  headerCellComponent?: ComponentBuilder;
  groupCellComponent?: ComponentBuilder;
}

type ComponentBuilder = StyledSubcomponentType | ((props: any) => JSX.Element) | React.FC;

/**
 * @deprecated Use `ColumnTypes`.
 */
export type columnTypes = Columns;

export type TableProps = {
  areGroupsCollapsible?: boolean;
  columnGap?: string;
  columns: Columns;
  data?: Columns[] | Array<Array<Columns>>;
  defaultSort?: [string, boolean]; // key, direction
  groupHeaderPosition?: 'above' | 'below';
  expansionIconComponent?: FunctionComponent<InternalExpansionIconProps>;
  /**
   * The width of the Table (in px) at which the Table collapses into vertical mode.
   */
  minWidthBreakpoint?: number;
  sortGroups?: boolean;

  StyledCell?: StyledSubcomponentType;
  StyledContainer?: StyledSubcomponentType;
  StyledGroupLabelRow?: StyledSubcomponentType;
  StyledHeader?: StyledSubcomponentType;
  StyledHeaderCell?: StyledSubcomponentType;
  /**
   * If in responsive mode (width < `minWidthBreakpoint`), the `StyledResponsiveHeaderCell` will appear next to the
   * `StyledCell`. By default, it displays the `name` of the column. This component is not displayed if not in responsive
   * mode, or if the column has no `name`.
   */
  StyledResponsiveHeaderCell?: StyledSubcomponentType;
  StyledRow?: StyledSubcomponentType;
  StyledFooter?: StyledSubcomponentType;
  StyledFooterCell?: StyledSubcomponentType;
  /**
   * If in responsive mode (width < `minWidthBreakpoint`), the `CellContainer` contains the `StyledCell`
   * and the `StyledResponsiveHeaderCellA `CellContainer` contains the `StyledCell`, as well as the `StyledResponsiveHeaderCell` for each cell
   * if width is less than `minWidthBreakpoint`. If width is greater than `minWidthBreakpoint`, then the `CellContainer`
   * only wraps the `StyledCell`.
   */
  StyledCellContainer?: StyledSubcomponentType;

  cellProps?: SubcomponentPropsType;
  containerProps?: SubcomponentPropsType;
  groupLabelRowProps?: SubcomponentPropsType;
  headerProps?: SubcomponentPropsType;
  headerCellProps?: SubcomponentPropsType;
  responsiveHeaderCellProps?: SubcomponentPropsType;
  rowProps?: SubcomponentPropsType;

  containerRef?: React.RefObject<HTMLTableElement>;
  groupLabelRowRef?: React.RefObject<HTMLElement>;
  headerRef?: React.RefObject<HTMLTableRowElement>;
  /**
   * @deprecated Do not use.
   */
  headerCellRef?: React.RefObject<HTMLTableCellElement>;
};

export type RowProps = {
  columnGap: string;
  columnWidths: string;
  rowNum?: number;
  reachedMinWidth?: boolean;
  isCollapsed?: boolean;
};

export type CellOptions = {
  RenderedCell: ComponentBuilder;
  headerColumnKey: string;
  breakPointHit: boolean;
  row: Columns;
  index: number;
  indexModifier?: number;
  CollapseExpandedIcon?: any;
  groupIndex?: number;
  isCollapsed?: boolean;
  groupLabelDataString?: string;
  cellProps?: SubcomponentPropsType;
};
