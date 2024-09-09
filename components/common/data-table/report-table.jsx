"use client";
import * as React from "react";

import DatePickerWithRange from "@/components/date-picker-with-range";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { X } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import TableSkeleton from "./TableSkeleton";

export function ReportsDataTable({
  data,
  columns,
  filterPlaceHolder,
  pagination,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  pageCount,
  setSearchString,
  searchString,
  hiddenOnly = false,
  tableLoading,
  status,
  startDate,
  endDate,
  handleStatusChange,
  handleStartDateChange,
  handleEndDateChange,
  handleReset,
  refetch,
  hiddenFilter = false,
  handleViewClick,
  rowClickable = false,
  showCheckbox = false,
  selectedRows,
  setSelectedRows,
  handleDeleteSelected = false,
  jobCardId = false,
  lable
}) {
  console.log(lable,"lable");
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [dateRange, setDateRange] = React.useState({ from: "", to: "" });
  const [selectedRowId, setSelectedRowId] = React.useState(null);

  const handleDateRangeChange = ({ from = null, to = null } = {}) => {
    if (from === null && to === null) {
      // Fetch all data
      setDateRange({ from, to });
      handleStartDateChange(null);
      handleEndDateChange(null);
      requestAnimationFrame(() => {
        refetch();
      });
    } else {
      // Fetch data within the selected date range
      setDateRange({ from, to });
      handleStartDateChange(from);
      handleEndDateChange(to);
      requestAnimationFrame(() => {
        refetch();
      });
    }
  };

  const table = useReactTable({
    data: data || [],
    columns: columns || [],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    pagination: {
      pageIndex,
      pageSize,
      pageCount,
      setPageIndex,
      setPageSize,
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  const resetFilters = () => {
    handleDateRangeChange({ from: null, to: null });
    table.resetColumnFilters();
  };

  const handleRowClick = (e,row) => {
    e.stopPropagation();
    setSelectedRowId(row.id);
    if (rowClickable && !jobCardId) {
      handleViewClick(row.original._id);
    } else if (rowClickable && jobCardId) {
      handleViewClick(e,row.original.jobCardId);
    }
  };

  const handleCheckboxChange = (row) => {
    setSelectedRows((prev) =>
      prev.includes(row.id)
        ? prev.filter((id) => id !== row.id)
        : [...prev, row.id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(
      checked ? table.getRowModel().rows.map((row) => row.id) : []
    );
  };

  return (
    <>
      <div className="">
        <div className="flex items-center flex-wrap gap-2 px-4">
          {!hiddenOnly && (
            <Input
              placeholder={`Filter ${filterPlaceHolder}...`}
              value={searchString || ""}
              onChange={(event) => setSearchString(event.target.value)}
              className="max-w-sm min-w-[200px] h-10"
            />
          )}
          {hiddenFilter && (
            <>
              <DataTableToolbar table={table} />
              <DatePickerWithRange
                onSelectDateRange={handleDateRangeChange}
                selectedDateRange={dateRange}
              />
            </>
          )}
          {(isFiltered || dateRange?.from || dateRange?.to) && (
            <Button
              variant="outline"
              onClick={resetFilters}
              className="bg-red-500 hover:bg-red-700 text-white h-8 px-4 lg:px-3 font-bold border-none py-2 rounded"
            >
              Reset
              <X className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
            </Button>
          )}
          {showCheckbox && selectedRows.length > 0 && (
            <Button
              variant="outline"
              onClick={() => handleDeleteSelected(selectedRows)}
              className="bg-red-500 hover:bg-red-700 text-white h-8 px-4 lg:px-3 font-bold border-none py-2 rounded"
            >
              Delete Selected
            </Button>
          )}
        </div>
        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {showCheckbox && (
                    <TableHead>
                      <Checkbox
                        checked={
                          selectedRows.length ===
                          table.getRowModel().rows.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {tableLoading ? (
                <TableSkeleton columns={columns} />
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    // onClick={() => handleRowClick(row)}
                    onClick={(e) => handleRowClick(e, row)}
                    className={`${rowClickable ? "cursor-pointer" : ""
                      } hover:bg-blue-100`}
                  >
                    {showCheckbox && (
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(row.id)}
                          onCheckedChange={() => handleCheckboxChange(row)}
                          onClick={(e) => e.stopPropagation()} // Prevent triggering rowClickable
                        />
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!hiddenOnly && (
          <DataTablePagination
            table={table}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageCount={pageCount}
          />
        )}
      </div>
    </>
  );
}

export default ReportsDataTable;
