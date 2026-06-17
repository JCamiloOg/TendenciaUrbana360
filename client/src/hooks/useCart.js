import { Toast } from "./useToastAlert";

export default function useCart() {
    let cartStorage = JSON.parse(localStorage.getItem("cart") || '[]');

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
        const product = { unique, id: id, modelo: productSelected, talla: sizesSelected || undefined, cantidad: 1, type: type };
        const isExistProduct = cartStorage.find(p => p.unique === unique);

        if (isExistProduct) {
            return Toast.fire({
                icon: "warning",
                title: 'Producto ya en el carrito',
                timer: 2000
            });
        }

        cartStorage.push(product);

        localStorage.setItem("cart", JSON.stringify(cartStorage));

        Toast.fire({
            icon: "success",
            title: 'Producto agregado al carrito',
            timer: 2000
        });
    }

    const updateAmount = async (id, opp, updateVal, fetchCart) => {
        let product = cartStorage.find(p => p.unique === id);
        let amount = product.cantidad;
        if (opp == "less") {
            if (amount == 1) return;
            amount--;
        } else {
            amount++
        }

        cartStorage = cartStorage.map(p => p.unique === id ? { ...p, cantidad: amount } : p);

        updateVal(amount);

        fetchCart(cartStorage);

        localStorage.setItem("cart", JSON.stringify(cartStorage));
    }


    const deleteProduct = async (id, fetchCart) => {
        cartStorage = cartStorage.filter(p => p.unique !== id);

        fetchCart(cartStorage);

        localStorage.setItem("cart", JSON.stringify(cartStorage));
    }

    return { handleAddCart, updateAmount, deleteProduct }
}