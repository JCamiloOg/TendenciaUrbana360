export default function Badge({ type, children }) {
    const options = {
        default: "bg-gray-200 hover:bg-gray-300 text-gray-600",
        success: "bg-green-200 hover:bg-green-300 text-green-600",
        danger: "bg-red-200 hover:bg-red-300 text-red-600",
        warning: "bg-yellow-200 hover:bg-yellow-300 text-yellow-600",
        info: "bg-blue-200 hover:bg-blue-300 text-blue-600",
    }
    const bg = options[type] || options.default;

    return (
        <span className={`inline-flex items-center m-2 px-3 py-1 rounded-full text-sm font-semibold ${bg}`}>
            <span className="ml-1">
                {children}
            </span>
        </span>
    )
}