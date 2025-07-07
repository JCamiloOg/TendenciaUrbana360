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

export default function Select({ data, labelKey = "label", valueKey = "ID", onChange }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const selectedLabel = data.find((item) => item[valueKey].toString() === value)?.[labelKey];

    useEffect(() => {
        if (onChange) onChange(value)
    }, [value, onChange])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between cursor-pointer font-bold"
                >
                    {value
                        ? selectedLabel
                        : `Elegir ${labelKey}...`}
                    <FontAwesomeIcon icon={faUpDown} className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
                <Command className={``}>
                    <CommandInput placeholder={`Buscar ${labelKey}...`} className="h-9 text-white" />
                    <CommandList>
                        <CommandEmpty>No se encontraron colores</CommandEmpty>
                        <CommandGroup>
                            {data.map((item) => (
                                <CommandItem
                                    key={item[valueKey]}
                                    value={item[valueKey].toString()}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue == value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                    className={`cursor-pointer hover:bg-[#00132c]`}
                                >
                                    {item[labelKey]}
                                    <FontAwesomeIcon icon={faCheck} className={value == item[valueKey].toString() ? "opacity-100" : "opacity-0"} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}