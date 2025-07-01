import "../../style/button.css"

export default function ButtonBlank({ color, letterColor, disabled, type, children, onClick }) {
    return (
        <button onClick={onClick} disabled={disabled} type={type} className={`btn-blank`} style={{ "--color": color, "--letterColor": letterColor }} >{children}</button>
    )
}