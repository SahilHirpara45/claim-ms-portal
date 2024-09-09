import {
  ChevronsLeft,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DataTablePagination({
  table,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  pageCount,
}) {
  // console.log(pagination, "datatable pagination");
  // const { currentPage, totalPages } = pagination;

  const handleFirstPageClick = () => {
    setPageIndex(0);
  };

  const handlePrevPageClick = () => {
    setPageIndex((prevPageIndex) => Math.max(prevPageIndex - 1, 0));
  };

  const handleNextPageClick = () => {
    setPageIndex((prevPageIndex) => Math.min(prevPageIndex + 1, pageCount - 1));
  };

  const handleLastPageClick = () => {
    setPageIndex(pageCount - 1);
  };
  return (
    <div className="flex items-center flex-wrap gap-2 justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap"></div>
      <div className="flex flex-wrap items-center gap-6 lg:gap-8 mb-4 justify-end">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Rows per page
          </p>
          {/* <Select
            value={`${pageSize}`}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          <Select
            value={`${pageSize}`}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50]?.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-muted-foreground">
            Page {pageIndex + 1} of {pageCount}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={handleFirstPageClick}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handlePrevPageClick}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handleNextPageClick}
              disabled={pageIndex === pageCount - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={handleLastPageClick}
              disabled={pageIndex === pageCount - 1}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    // <div className="flex justify-end">
    //   <button onClick={handleFirstPageClick} disabled={pageIndex === 0}>
    //     First
    //   </button>
    //   <button onClick={handlePrevPageClick} disabled={pageIndex === 0}>
    //     Previous
    //   </button>
    //   <span>
    //     Page {pageIndex + 1} of {pageCount}
    //   </span>
    //   <button
    //     onClick={handleNextPageClick}
    //     disabled={pageIndex === pageCount - 1}
    //   >
    //     Next
    //   </button>
    //   <button
    //     onClick={handleLastPageClick}
    //     disabled={pageIndex === pageCount - 1}
    //   >
    //     Last
    //   </button>
    // </div>
  );
}
