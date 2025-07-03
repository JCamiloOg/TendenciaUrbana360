export default function Badge({ type, children }) {
    const options = {
        default: "bg-gray-800 text-white",
        primary: "bg-indigo-500 text-white",
        success: "bg-green-500 text-white",
        danger: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-black",
        info: "bg-blue-500 text-white",
    }
    const bg = options[type] || options.default;

    return (
        <span className={`${bg} rounded-full px-3 py-2 w-35 text-center text-xs uppercase font-bold`}>{children}</span>
    )
}