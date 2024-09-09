"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useEffect } from "react";

export default function DashDashDatePickerWithRange({
  className,
  onDateChange,
  isActive,
  resetDate,
}) {
  const [date, setDate] = useState(null);
  const { theme: mode } = useTheme();

  useEffect(() => {
    if (resetDate) {
      setDate(null);
    }
  }, [resetDate]);

  useEffect(() => {
    if (date) {
      const fromDate = date.from ? format(date.from, "yyyy-MM-dd") : null;
      const toDate = date.to ? format(date.to, "yyyy-MM-dd") : null;
      onDateChange({ fromDate, toDate });
    }
  }, [date]);

  const buttonClassName = isActive ? "bg-primary text-white" : "shadow-md";

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover className="shadow-md">
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("font-normal", buttonClassName)}>
            <CalendarIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
