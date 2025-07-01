import divider from "../assets/divider.svg";

export default function Divider() {
    return (
        <div className={`w-full h-7 bg-no-repeat bg-center mt-1 mb-1 `} style={{ backgroundImage: `url("${divider}")` }}></div>
    )

}