import { useState } from "react";

export default function useAccordion() {
    const [openAccordion, setOpenAccordion] = useState(false);

    const toggle = () => {
        setOpenAccordion(!openAccordion);
    }

    const closeAccordion = () => {
        setOpenAccordion(false);
    }

    return { openAccordion, toggle, closeAccordion }
}