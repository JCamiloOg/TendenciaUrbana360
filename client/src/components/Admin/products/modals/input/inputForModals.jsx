import { useState } from "react";

export default function InputFieldModal({ label, type = "text", error, defaultValue = "", ...props }) {
    const [value, setValue] = useState(defaultValue);

    return (
        <div className="mb-5">
            <div className="relative">
                <input
                    {...props}
                    type={type}
                    className={`peer border-b-2 ${error ? "border-red-500" : "focus:border-blue-500 border-gray-300"}  py-1  transition-colors focus:outline-none peer bg-inherit w-full`}
                    onInput={(e) => {
                        setValue(e.target.value);
                    }}
                    defaultValue={value}
                />
                <label
                    className={`absolute left-0 cursor-text ${value ? "-top-4 text-xs" : "peer-focus:-top-4 peer-focus:text-xs"} transition-all ${error ? " text-red-500" : "peer-focus:text-blue-500"}`}
                >{label}</label>
            </div>
            {
                error && (
                    <span className="text-red-500">{error}</span>
                )
            }
        </div>
    )
}