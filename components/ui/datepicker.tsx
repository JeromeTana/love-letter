import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { FormControl } from "./form";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

import { Calendar } from "./calendar";

export function DatePicker({ field, placeholder = "Pick a date" }: any) {
  const [calendarPop, setCalendarPop] = useState(false);

  return (
    <Popover modal open={calendarPop} onOpenChange={setCalendarPop}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field?.value, "PPPP", { locale: enGB })
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={field.value || new Date()}
          selected={field.value}
          onSelect={(e) => {
            field.onChange(e);
            setCalendarPop(false);
          }}
          disabled={(date) =>
            date < new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
