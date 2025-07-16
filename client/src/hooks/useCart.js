import { getCart, saveCart } from "@/services/cartService";
import { Toast } from "./useToastAlert";

export default function useCart() {
    let cartStorage = JSON.parse(localStorage.getItem("cart"));

    const handleAddCart = async (productSelected, sizesSelected, id, type) => {
        if (type === "perfumes") {
            if (!productSelected) {
                return Toast.fire({
                    icon: "warning",
                    title: 'Seleccione todos los campos.',
                    timer: 3000
                });

            }
        } else if (type === "calzado" || type === "pantalones" || type === "camisas") {
            if (!sizesSelected || !productSelected) {
                return Toast.fire({
                    icon: "warning",
                    title: 'Seleccione todos los campos.',
                    timer: 3000
                });
            }
        } else {
            if (!productSelected) {
                return Toast.fire({
                    icon: "warning",
                    title: 'Seleccione todos los campos.',
                    timer: 3000
                });
            }
        }

        const unique = `${productSelected || ""}${sizesSelected || ""}`;
        const product = { id: id, modelo: productSelected, talla: sizesSelected || undefined, cantidad: 1 };
        console.log(cartStorage);
        if (cartStorage[unique]) {
            return Toast.fire({
                icon: "warning",
                title: 'Producto ya en el carrito',
                timer: 2000
            });
        }

        cartStorage[unique] = product;

        const res = await saveCart(cartStorage);
        if (res.status === 200) {
            localStorage.setItem("cart", JSON.stringify(cartStorage));
            Toast.fire({
                icon: "success",
                title: 'Producto agregado al carrito',
                timer: 2000
            })
        } else {
            Toast.fire({
                icon: "error",
                title: 'Error al agregar al carrito',
                timer: 2000
            })
        }
    }

    const updateAmount = async (id, opp, updateVal, cart) => {
        let amount = cartStorage[id].cantidad;
        if (opp == "less") {
            if (amount == 1) return;
            amount--;
        } else {
            amount++
        }

        cartStorage[id].cantidad = amount;

        updateVal(amount);

        localStorage.setItem("cart", JSON.stringify(cartStorage))
        await saveCart(cartStorage);

        const res = await getCart();
        if (res.status === 200) {
            cart(res.data.cart);
        }
    }


    const deleteProduct = async (id, cart) => {
        delete cartStorage[id];
        localStorage.setItem("cart", JSON.stringify(cartStorage));

        await saveCart(cartStorage);

        const res = await getCart();
        if (res.status === 200) {
            cart(res.data.cart);
        }


    }

    return { handleAddCart, updateAmount, deleteProduct }
}