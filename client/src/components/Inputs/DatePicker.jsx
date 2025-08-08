import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react"
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { formatDate } from "@/utils/formatDate";

export default function DatePicker({ label, text, onChange, dark = false }) {
    const [date, setDate] = useState(null)
    const [open, setOpen] = useState(false);
    return (
        <div className={`flex flex-col gap-3 `}>
            <label htmlFor="date" className="px-1">
                {label}
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className={`w-48 justify-between font-normal cursor-pointer ${dark ? "bg-[#353535] hover:bg-[#4a4a4a] hover:text-white text-white border-none" : "bg-white text-black "}`}
                    >
                        {date ? formatDate(date.toLocaleDateString()) : text}
                        <FontAwesomeIcon icon={faChevronDown} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={`w-auto overflow-hidden p-0 z-10 ${dark ? "bg-[#353535]" : "bg-white"}`} align="start">
                    <Calendar
                        className={`${dark ? "bg-[#353535] text-white rounded-md" : "bg-white"}`}
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                            onChange(date ? date.toLocaleDateString() : null);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}