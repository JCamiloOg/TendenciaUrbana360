import { useRef, useState } from "react"

export default function TextArea({ placeHolder, label, error, defaultValue = "", ...props }) {
    const [value, setValue] = useState(defaultValue);
    const textAreaRef = useRef(null);

    const handleInput = () => {
        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.style.height = "auto"
            textArea.style.height = `${textArea.scrollHeight}px`
        }
    };

    return (
        <div className="max-w-2xl mx-auto mb-4">
            <label className="block mb-2 text-sm font-medium text-white">{label}</label>
            <textarea
                ref={textAreaRef}
                {...props}
                onInput={(e) => {
                    handleInput();
                    setValue(e.target.value)
                }}
                rows="3"
                defaultValue={value}
                className={`block p-2.5 w-full text-sm text-white bg-[#353535] rounded-lg focus:outline-none ${error ? "ring-1 focus:ring-2 ring-red-500 border-transparent" : "focus:ring-blue-500 focus:border-transparent focus:ring-2"} border overflow-hidden`}
                placeholder={placeHolder}
            >
            </textarea>
            {
                error && (
                    <span className="text-red-500 mt-5">{error}</span>
                )
            }
        </div>
    )
}