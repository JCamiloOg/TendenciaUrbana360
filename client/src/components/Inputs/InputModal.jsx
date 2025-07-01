export default function InputModal({ type, placeholder, isError, ...rest }) {
    return (
        <input
            {...rest}
            type={type}
            placeholder={placeholder}
            className={`mb-2 block w-full ${isError ? "border-red-600 focus:ring-red-600 focus:ring-2" : "focus:ring-blue-900 focus:ring-2 focus:ring-offset-1"} rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400  transition-all duration-300  `}
        />

    )
}