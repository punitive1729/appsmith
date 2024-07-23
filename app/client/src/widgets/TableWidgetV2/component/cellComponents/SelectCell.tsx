import React from "react";
import SelectComponent from "widgets/SelectWidget/component";
import styled from "styled-components";
import type { DropdownOption } from "widgets/SelectWidget/constants";
import type { BaseCellComponentProps } from "../Constants";
import {
  EDITABLE_CELL_PADDING_OFFSET,
  SelectColumnDisplayAsKeys,
  TABLE_SIZES,
} from "../Constants";
import { CellWrapper } from "../TableStyledWrappers";
import type { EditableCellActions } from "widgets/TableWidgetV2/constants";
import { BasicCell } from "./BasicCell";
import { useCallback } from "react";

const StyledSelectComponent = styled(SelectComponent)<{
  accentColor: string;
  height: number;
  isNewRow: boolean;
  selectDisplayAs: string;
}>`
  &&& {
    width: ${(props) =>
      props.isNewRow
        ? `calc(100% - ${EDITABLE_CELL_PADDING_OFFSET}px)`
        : "100%"};

    .bp3-control-group {
      height: ${(props) => {
        return props.isNewRow
          ? `${props.height - EDITABLE_CELL_PADDING_OFFSET}px`
          : `${props.height}px`;
      }};

      & > :only-child {
        border-radius: 0;
      }

      & button.bp3-button {
        border-color: #fff;
        padding: 0 9px;
        min-height: ${(props) => {
          return props.isNewRow
            ? `${props.height - EDITABLE_CELL_PADDING_OFFSET}px`
            : `${props.height}px`;
        }};
        border-radius: 3px;
      }
    }

    .bp3-popover-target > div {
      width: 100%;
    }
  }
`;

const StyledCellWrapper = styled(CellWrapper)`
  padding: 0px;
  justify-content: center;
`;

type SelectProps = BaseCellComponentProps & {
  alias: string;
  accentColor: string;
  autoOpen: boolean;
  columnType: string;
  borderRadius: string;
  options?: DropdownOption[];
  selectDisplayAs: SelectColumnDisplayAsKeys;
  onFilterChange: (
    text: string,
    rowIndex: number,
    serverSideFiltering: boolean,
    alias: string,
    action?: string,
  ) => void;
  onItemSelect: (
    value: string | number,
    rowIndex: number,
    column: string,
    action?: string,
  ) => void;
  value: string;
  width: number;
  isEditable: boolean;
  tableWidth: number;
  isCellEditable?: boolean;
  isCellEditMode?: boolean;
  disabledEditIcon: boolean;
  hasUnsavedChanges?: boolean;
  toggleCellEditMode: (
    enable: boolean,
    rowIndex: number,
    alias: string,
    value: string | number,
    onSubmit?: string,
    action?: EditableCellActions,
  ) => void;
  rowIndex: number;
  isFilterable?: boolean;
  serverSideFiltering?: boolean;
  filterText?: string;
  placeholderText?: string;
  resetFilterTextOnClose?: boolean;
  onOptionSelectActionString?: string;
  onFilterChangeActionString?: string;
  disabledEditIconMessage: string;
  isNewRow: boolean;
};

/*
 * TODO: Need a widgetId for each select cell.
 */
export const SelectCell = (props: SelectProps) => {
  const {
    accentColor,
    alias,
    allowCellWrapping,
    autoOpen,
    borderRadius,
    cellBackground,
    columnType,
    compactMode,
    disabledEditIcon,
    disabledEditIconMessage,
    filterText,
    fontStyle,
    hasUnsavedChanges,
    horizontalAlignment,
    isCellDisabled,
    isCellEditable,
    isCellEditMode,
    isCellVisible,
    isEditable,
    isFilterable = false,
    isHidden,
    isNewRow,
    onFilterChange,
    onFilterChangeActionString,
    onItemSelect,
    onOptionSelectActionString,
    options = [],
    placeholderText,
    resetFilterTextOnClose,
    rowIndex,
    selectDisplayAs = SelectColumnDisplayAsKeys.VALUE,
    serverSideFiltering = false,
    tableWidth,
    textColor,
    textSize,
    toggleCellEditMode,
    value,
    verticalAlignment,
    width,
  } = props;

  const onSelect = useCallback(
    (option: DropdownOption) => {
      onItemSelect(
        option.value || "",
        rowIndex,
        alias,
        onOptionSelectActionString,
      );
    },
    [
      onItemSelect,
      rowIndex,
      alias,
      onOptionSelectActionString,
      selectDisplayAs,
    ],
  );
  const onFilter = useCallback(
    (text: string) => {
      onFilterChange(
        text,
        rowIndex,
        serverSideFiltering,
        alias,
        onFilterChangeActionString,
      );
    },
    [
      onFilterChange,
      rowIndex,
      serverSideFiltering,
      onFilterChangeActionString,
      alias,
    ],
  );

  const onClose = useCallback(
    () => toggleCellEditMode(false, rowIndex, alias, value),
    [toggleCellEditMode, rowIndex, alias, value],
  );

  const onClick = useCallback((e) => e.stopPropagation(), []);

  const selectedIndex = (Array.isArray(options) ? options : [])
    .filter((d: DropdownOption) => d)
    .map((d: DropdownOption) => d.value)
    .indexOf(value);

  // Compute cell display value using selectDisplayAs
  const getCellDisplayValue = useCallback(() => {
    // Default cell value is the provided value
    let cellValue: string | number | undefined | null = value;

    // If selectDisplayAs is LABEL, find the corresponding option label
    if (selectDisplayAs === SelectColumnDisplayAsKeys.LABEL) {
      const selectedOption = options.find(
        (option) => option[SelectColumnDisplayAsKeys.VALUE] === value,
      );

      // Set cell value to the label of the selected option or an empty string if not found
      cellValue = selectedOption
        ? selectedOption[SelectColumnDisplayAsKeys.LABEL]
        : "";
    }

    return cellValue || "";
  }, [selectDisplayAs, value, options]);

  const cellContent = getCellDisplayValue();

  if (isEditable && isCellEditable && isCellEditMode) {
    return (
      <StyledCellWrapper
        allowCellWrapping={allowCellWrapping}
        cellBackground={cellBackground}
        compactMode={compactMode}
        fontStyle={fontStyle}
        horizontalAlignment={horizontalAlignment}
        isCellDisabled={isCellDisabled}
        isCellVisible={isCellVisible}
        isHidden={isHidden}
        onClick={onClick}
        textColor={textColor}
        textSize={textSize}
        verticalAlignment={verticalAlignment}
      >
        <StyledSelectComponent
          accentColor={accentColor}
          borderRadius={borderRadius}
          compactMode
          dropDownWidth={width}
          filterText={filterText}
          height={TABLE_SIZES[compactMode].ROW_HEIGHT}
          hideCancelIcon
          isFilterable={isFilterable}
          isLoading={false}
          isNewRow={isNewRow}
          isOpen={autoOpen}
          isValid
          labelText=""
          onClose={onClose}
          onFilterChange={onFilter}
          onOptionSelected={onSelect}
          options={options}
          placeholder={placeholderText}
          resetFilterTextOnClose={resetFilterTextOnClose}
          selectDisplayAs={selectDisplayAs}
          selectedIndex={selectedIndex}
          serverSideFiltering={serverSideFiltering}
          value={cellContent}
          widgetId={""}
          width={width}
        />
      </StyledCellWrapper>
    );
  } else {
    const onEdit = () => toggleCellEditMode(true, rowIndex, alias, value);

    return (
      <BasicCell
        accentColor={accentColor}
        allowCellWrapping={allowCellWrapping}
        cellBackground={cellBackground}
        columnType={columnType}
        compactMode={compactMode}
        disabledEditIcon={disabledEditIcon}
        disabledEditIconMessage={disabledEditIconMessage}
        fontStyle={fontStyle}
        hasUnsavedChanges={hasUnsavedChanges}
        horizontalAlignment={horizontalAlignment}
        isCellDisabled={isCellDisabled}
        isCellEditMode={isCellEditMode}
        isCellEditable={isCellEditable}
        isCellVisible={isCellVisible}
        isHidden={isHidden}
        onEdit={onEdit}
        tableWidth={tableWidth}
        textColor={textColor}
        textSize={textSize}
        value={cellContent}
        verticalAlignment={verticalAlignment}
      />
    );
  }
};
