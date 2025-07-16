import "../style/gradient.css"

export default function Title({ text }) {
    return (
        <>
            <h1 className="text-center text-5xl font-semibold my-10 text-transparent bg-clip-text bg-gradient-to-r from-[#004aad] via-[#ffd200] to-[#004aad] textGradient">{text}</h1>
        </>
    )

}