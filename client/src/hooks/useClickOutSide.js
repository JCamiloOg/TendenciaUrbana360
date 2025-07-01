import { useEffect } from "react";
export function useClickOutSide(refs = [], handler) {
    useEffect(() => {
        const listener = (e) => {
            const clickedInside = refs.some(ref => ref.current && ref.current.contains(e.target));

            if (!clickedInside) handler(e);
        };
        document.addEventListener("mousedown", listener);

        return () => document.removeEventListener("mousedown", listener);

    }, [refs, handler]);
}