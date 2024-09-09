"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useEffect } from "react";
export default function DatePickerWithRange({
  className,
  onSelectDateRange,
  selectedDateRange,
  message
}) {
  // const [date, setDate] = React.useState(null);
  const [dateRange, setDateRange] = useState(
    selectedDateRange || { from: null, to: null }
  );

  useEffect(() => {
    setDateRange(selectedDateRange || { from: null, to: null });
  }, [selectedDateRange]);

  const handleSelect = (dates) => {
    setDateRange(dates);
    if (onSelectDateRange) {
      onSelectDateRange(dates);
    }
  };
  console.log(dateRange?.from, "dateRange");
  console.log(dateRange?.to, "dateRange");

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-8 px-2 lg:px-3">
            <CalendarIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
            {dateRange?.from && dateRange?.to ? (
              `${format(new Date(dateRange.from), "yyyy/MM/dd")} - ${format(
                new Date(dateRange.to),
                "yyyy/MM/dd"
              )}`
            ) : (
              // <span>Pick a date range</span>
              <span>{message}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>

    // <div className={cn("grid gap-2", className)}>
    //   <Popover>
    //     <PopoverTrigger asChild>
    //       <Button
    //         variant="outline"
    //         className="h-8 px-2 lg:px-3"
    //         // color={mode === "dark"}
    //         // className={cn(" font-normal", {
    //         //   " bg-white text-default-600": mode !== "dark",
    //         // })}
    //       >
    //         <CalendarIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
    //         {date?.from ? (
    //           date.to ? (
    //             <>
    //               {format(date.from, "LLL dd, y")} -{" "}
    //               {format(date.to, "LLL dd, y")}
    //             </>
    //           ) : (
    //             format(date.from, "LLL dd, y")
    //           )
    //         ) : (
    //           <span>Pick a date</span>
    //         )}
    //       </Button>
    //     </PopoverTrigger>
    //     <PopoverContent className="w-auto p-0" align="end">
    //       <Calendar
    //         initialFocus
    //         mode="range"
    //         defaultMonth={date?.from}
    //         selected={date}
    //         onSelect={setDate}
    //         numberOfMonths={1}
    //       />
    //     </PopoverContent>
    //   </Popover>
    // </div>
  );
}
