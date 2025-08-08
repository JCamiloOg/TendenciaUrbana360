import { IMG_URL } from "@/config"

export default function ImageSelector({ options, onSelect, selectedId }) {
    return (
        <div className="grid grid-cols-2 max-h-70 overflow-y-auto sm:grid-cols-3 sm:overflow-y-auto md:grid-cols-2 md:overflow-y-auto lg:grid-cols-2 lg:overflow-y-auto xl:grid-cols-3 xl:overflow-y-auto  gap-4">
            {options.map((option, idx) => (
                <button
                    key={option.ID}
                    onClick={() => onSelect(idx, option.ID)}
                    className={`border-2  rounded-md overflow-hidden transition-all duration-300 p-1 cursor-pointer ${selectedId === idx
                        ? "border-[#002960] shadow-xl" : "border-gray-300 hover:border-[#004aad]"}`}
                >
                    <img
                        src={IMG_URL + option.Imagen}
                        alt={option.Color}
                        className="w-full h-24 object-cover"
                    />
                    <div className="text-center text-sm font-medium mt-1">{option.Color}</div>
                </button>
            ))}
        </div>
    )
}
