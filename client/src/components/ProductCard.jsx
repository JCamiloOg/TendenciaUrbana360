import { formatTypeProduct } from "@/utils/formatUrl";
import { Link } from "react-router-dom";

export default function ProductCard({ ID, img, name, price, typeProduct }) {
    const image = `${img}`
    return (
        <Link to={`/products/${formatTypeProduct(typeProduct)}/${ID}`} className="max-w-sm hover:text-blue-400 transition-all bg-white rounded-xl cursor-pointer shadow-lg overflow-hidden hover:shadow-xl duration-300">
            <img className="w-100 h-70 object-cover" src={image} alt={name} />
            <div className="p-5">
                <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-blue-500">$ {Intl.NumberFormat().format(price)}</span>
                </div>
            </div>
        </Link>
    )
}