export default function Alert({ type, firstText, span, secondText }) {
    const alertOptions = {
        "success": "bg-green-50 text-green-500",
        "error": "bg-red-50 text-red-600",
        "warning": "bg-yellow-50 text-yellow-600",
        "info": "bg-blue-50 text-blue-500"
    }

    const alert = alertOptions[type] || alertOptions["info"];

    return (
        <div class={`px-6 py-4 ${alert} rounded-lg`}>
            {firstText} <span class="font-bold">{span}</span> {secondText}
        </div>
    )

}