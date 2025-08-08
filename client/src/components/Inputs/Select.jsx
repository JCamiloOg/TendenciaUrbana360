import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faUpDown } from "@fortawesome/free-solid-svg-icons"

export default function Select({ data, labelKey = "label", valueKey = "ID", onChange, error, defaultValue = "" }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue);

    const selectedLabel = data.find((item) => item[valueKey].toString() === value)?.[labelKey];

    useEffect(() => {
        if (onChange) onChange(value)
    }, [value, onChange])

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button

                        role="combobox"
                        aria-expanded={open}
                        className={`w-full justify-between border border-transparent  cursor-pointer !bg-[#212121] text-md ${error ? "border-red-500 text-red-500" : ""}`}
                    >
                        {value
                            ? selectedLabel
                            : `Elegir ${labelKey}...`}
                        <FontAwesomeIcon icon={faUpDown} className="opacity-50 " />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className=" p-0 !bg-[#353535]">
                    <Command className={`!bg-[#353535]`}>
                        <CommandInput placeholder={`Buscar ${labelKey}...`} className="placeholder:text-white flex w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 h-9 !text-white" />
                        <CommandList>
                            <CommandEmpty className="py-6 text-center text-sm text-white font-semibold">No se encontró {labelKey}</CommandEmpty>
                            <CommandGroup>
                                {data.map((item) => (
                                    <CommandItem
                                        key={item[valueKey]}
                                        value={item[valueKey].toString()}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue == value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                        className={`data-[selected=true]:bg-[#4a4a4a] data-[selected=true]:text-white data-[selected=false]:text-white [&_svg:not([class*='text-'])]:text-muted-foreground relative flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer w-full justify-between font-semibold`}
                                    >
                                        {item[labelKey]}
                                        <FontAwesomeIcon icon={faCheck} className={`text-white ${value == item[valueKey].toString() ? "opacity-100" : "opacity-0"}`} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {
                error && (
                    <span className="text-red-500 mt-6">{error}</span>
                )
            }
        </>
    )
}