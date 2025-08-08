import "@/style/fileInput.css";

export default function InputFile({ error, ...props }) {
    return (
        <>
            <label className="drop-container">
                <span className="drop-title">Suelta la imagen</span>
                o
                <input type="file" accept="image/*" id="file-input" {...props} />
            </label>
            {
                error && (
                    <span className="text-red-500 mt-6">{error}</span>
                )
            }
        </>
    )
}