// Modules
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Components
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import ModalImage from "../Modals/ModalImage";
import { Progress } from "../ui/progress";
import AmountButtons from "./AmountButtons";
import TotalCart from "./TotalCart";
import TotalProduct from "./TotalProduct";
import ButtonBlank from "../Buttons/ButtonBlank";

// Hooks
import useIsMobile from "@/hooks/useIsMobile";
import useCart from "@/hooks/useCart"

// services
import { getCart, getCartStorage } from "@/services/cartService";

//utils


export default function Cart({ isOpen, updateVal }) {
    // states
    const [open, setOpen] = useState(isOpen);
    const [cart, setCart] = useState([]);
    const [progress, setProgress] = useState(13);
    const [loading, setLoanding] = useState(false);
    const [total, setTotal] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [image, setImage] = useState("");
    const [isOpenModalImage, setIsOpenModalImage] = useState(false);

    // hooks
    const isMobile = useIsMobile();
    const { updateAmount, deleteProduct } = useCart();
    const navigate = useNavigate();

    const fetchCart = async () => {
        setLoanding(true);
        try {
            setProgress(66);
            const res = await getCart();
            if (res.status === 200) {
                setCart(res.data.cart);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setProgress(100);
            }, 500);
            setLoanding(false);
        }
    }

    const fetchCartStorage = async () => {
        try {
            const res = await getCartStorage();
            if (res.status === 200) {
                const cart = res.data.cart || {}
                localStorage.setItem("cart", JSON.stringify(cart));
            }
        } catch (e) {
            console.error(e);
        }
    }
    useEffect(() => {
        fetchCartStorage();
    }, []);

    useEffect(() => {
        if (cart && cart.length > 0) {
            let total = 0;
            let totalProducts = 0;
            cart.forEach((item) => {
                total += item.PrecioTipo ? item.PrecioTipo : item.Precio * item.Cantidad;
                totalProducts += 1 * item.Cantidad;
            })
            setTotal(total);
            setTotalProducts(totalProducts);
            fetchCartStorage();
        }
    }, [cart])

    useEffect(() => {
        setOpen(isOpen);
        if (isOpen == true) fetchCart();
        else {
            const time = setTimeout(() => {
                setCart([]);
                setLoanding(false);
                setProgress(13);
            }, 500);

            return () => {
                clearTimeout(time);
            }
        }
    }, [isOpen]);


    const handleOpenChange = (value) => {
        setOpen(value);
        if (updateVal) {
            updateVal(value);
        }
    }
    const handleModalImage = (img) => {
        setIsOpenModalImage(!isOpenModalImage);
        setImage(img);
    }

    const handlePurchase = () => {
        navigate("/clients/order/confirmAdress")
    }

    return (
        <>
            <Sheet open={open} onOpenChange={handleOpenChange}>
                <SheetContent side="right" className={`bg-[#ededed] !max-w-[400px] sm:!max-w-[400px] md:!max-w-[400px] lg:!max-w-[500px] xl:!max-w-[500px] 2xl:!max-w-[500px] `}>
                    <SheetHeader>
                        <SheetTitle className={`text-2xl`}>Carrito</SheetTitle>
                        <SheetDescription>{typeof cart == "undefined" || cart.length == 0 ? `` : `${totalProducts == 1 ? "Tienes un producto en el carrito" : `Tienes un total de ${totalProducts} productos en tu carrito.`}`}</SheetDescription>
                    </SheetHeader>
                    <div className={`p-4 h-full overflow-y-auto`}>
                        {
                            loading ?
                                (<Progress value={progress} className={`w-full`} />)
                                :
                                !cart || cart.length == 0 ?
                                    (<h1 className="text-2xl text-center font-semibold">No hay productos en el carrito</h1>)
                                    :
                                    (
                                        <ul role="list" className="-my-6 divide-y divide-gray-700">
                                            {cart.map((item, idx) => (
                                                <li className="flex py-6" key={idx}>
                                                    {
                                                        !isMobile ?
                                                            <div onClick={() => handleModalImage(item.Imagen)} className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200 cursor-pointer">
                                                                <img src={item.Imagen} alt={item.Nombre} className="size-full object-cover" />
                                                            </div>
                                                            :
                                                            <></>
                                                    }

                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                <h3>
                                                                    <Link to={`/products/${item.Type}/${item.Id_producto}`} className={` decoration-1 underline cursor-pointer`}>{item.Nombre}</Link>
                                                                </h3>
                                                                <TotalProduct total={item.PrecioTipo ? item.PrecioTipo : item.Precio * item.Cantidad} />
                                                            </div>
                                                            {item.Color ? <p className="mt-1 text-sm text-gray-500">{item.Color}</p> : <></>}
                                                            {item.Talla ? <p className="mt-1 text-sm text-gray-500">{item.Talla}</p> : <></>}
                                                            {item.Tipo ? <p className="mt-1 text-sm text-gray-500">{item.Tipo}</p> : <></>}
                                                        </div>
                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                            <p className="text-gray-500">Cant: </p>
                                                            <div className="flex text-lg">
                                                                <AmountButtons id={`${item.ID}${item.TallaID ? item.TallaID : ""}`} initialQty={item.Cantidad} updateQty={updateAmount} cart={setCart} />
                                                            </div>
                                                            <div className="flex">
                                                                <button onClick={() => deleteProduct(`${item.ID}${item.TallaID ? item.TallaID : ""}`, setCart)} type="button" className="font-medium text-red-700 hover:text-red-900 cursor-pointer">Eliminar</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                        }
                    </div>
                    <SheetFooter>
                        {
                            cart && cart.length > 0 ?
                                <>
                                    <TotalCart total={total} />
                                    <ButtonBlank className={`w-full`} color="#28a745" onClick={handlePurchase} >Continuar con la compra</ButtonBlank>
                                </>
                                :
                                <></>
                        }
                        <SheetClose asChild>
                            <ButtonBlank className={`w-full`} color="#004aad" >Cerrar</ButtonBlank>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <ModalImage image={image} isOpen={isOpenModalImage} updateVal={setIsOpenModalImage} />
        </>
    )
}