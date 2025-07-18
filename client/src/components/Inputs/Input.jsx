import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InputField({ icon, label, type, error, ...rest }) {
    return (
        <>
            <div className={`[--clr:#1f1f1f]  relative flex flex-row items-center mt-7 ${error ? "" : "mb-7"}`}>
                <input
                    {...rest}
                    aria-invalid="false"
                    placeholder=""
                    spellCheck="false"
                    type={type}
                    className={`peer pl-2 h-[40px] min-h-[40px] pr-[40px] leading-normal appearance-none resize-none box-border text-base w-full  block text-left border  ${error ? "border-red-600 text-red-500 focus-visible:border-red-500 focus-visible:ring-[#ff7c7c2e]" : "border-solid text-black focus-visible:border-[#004aad] focus-visible:ring-[#6d6de42e]"} bg-white  m-0 p-0 outline-0 focus-visible:outline-0  focus-visible:outline-none focus-visible:ring-4 `}
                />
                <label
                    className={`cursor-text text-[--clr] inline-block z-0 text-sm mb-px text-start select-none absolute duration-300 transform origin-[0] translate-x-[32px] ${error ? "peer-focus-visible:text-red-500 text-red-500" : "peer-focus-visible:text-[#004aad] text-black"}  peer-focus-visible:translate-x-[8px] peer-[:not(:placeholder-shown)]:translate-x-[8px] peer-focus-visible:translate-y-[-36px] peer-[:not(:placeholder-shown)]:translate-y-[-36px] peer-[:not(:placeholder-shown)]:text-[-36px] font-normal`}
                    htmlFor="email">
                    {label}
                </label>
                <span className={`pointer-events-none ${error ? "text-red-500" : "text-black"} absolute z-[+1] left-0 top-0 bottom-0 flex items-center justify-center size-[40px]  peer-focus-visible:hidden peer-[:not(:placeholder-shown)]:hidden`}>
                    <FontAwesomeIcon icon={icon} />
                </span>
            </div>
            {
                error ?
                    <p className="text-red-500 mb-7 break-words whitespace-normal">{error}</p>
                    :
                    <></>
            }
        </>
    )

}