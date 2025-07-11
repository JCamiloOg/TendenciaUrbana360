export default function SelectRounded({ options = [], labelKey = "label", valueKey = "ID", selected, onSelect }) {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
            {options.map((option) => (
                <button
                    key={option[valueKey]}
                    onClick={() => onSelect(option[valueKey])
                    }
                    className={`border-2 cursor-pointer rounded-4xl overflow-hidden transition-all duration-300 p-1 ${selected === option[valueKey] ? "border-[#002960] border-2 shadow-xl" : "border-gray-300 hover:border-[#004aad]"}`}>
                    {
                        option[labelKey]
                    }
                </button>
            ))}
        </div>
    )
}