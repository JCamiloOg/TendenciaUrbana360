import { useState } from "react";

export function useModalLogin() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const open = () => {
        setIsOpenModal(true);
        setTimeout(() => setIsVisible(true), 10);
    }

    const close = () => {
        setIsVisible(false);
        setTimeout(() => setIsOpenModal(false), 300);
    }

    const toggle = () => {
        if (isOpenModal) close();
        else open();
    }


    return { isOpenModal, isVisible, open, close, toggle };
}

export function useModalRegister() {
    const [isOpenModalRegister, setIsOpenModal] = useState(false);
    const [isVisibleReigster, setIsVisible] = useState(false);

    const openRegister = () => {
        setIsOpenModal(true);
        setTimeout(() => setIsVisible(true), 10);
    }

    const closeRegister = () => {
        setIsVisible(false);
        setTimeout(() => setIsOpenModal(false), 300);
    }

    const toggle = () => {
        if (isOpenModalRegister) closeRegister();
        else open();
    }


    return { isOpenModalRegister, isVisibleReigster, openRegister, closeRegister, toggle };

}
