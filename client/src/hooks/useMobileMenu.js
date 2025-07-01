import { useState } from "react";

export function useMobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const close = () => setIsOpen(false);
    return { isOpen, toggle, close }
}


export function useUserMenu() {
    const [isOpenUser, setIsOpen] = useState(false);
    const toggleUser = () => setIsOpen(!isOpenUser);
    const closeUser = () => setIsOpen(false);
    return { isOpenUser, toggleUser, closeUser }
}