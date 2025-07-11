import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import getExtension from "@/utils/getExtension";
import { useEffect, useState } from "react";

export default function ModalImage({ image, isOpen, updateVal }) {
    const [open, setOpen] = useState(isOpen);

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen]);

    const handleOpenChange = (value) => {
        setOpen(value);
        if (updateVal) {
            updateVal(value);
        }
    };
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className={`max-w-5/6 sm:max-w-[530px] md:max-w-[600px] lg:max-w-[600px] xl:max-w-[600px] 2xl:max-w-[600px] p-0 border-none bg-transparent shadow-none`}>
                <DialogHeader className="hidden">
                    <DialogTitle className="text-center text-2xl font-semibold">Guía de tallas</DialogTitle>
                    <DialogDescription className="text-center text-lg font-medium">Selecciona la talla adecuada para tu producto</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center">
                    {
                        getExtension(image) === "webp" || getExtension(image) === "jpg" || getExtension(image) === "jpeg" || getExtension(image) === "png" ?
                            <img src={image} alt="Guía de tallas" className="w-full max-h-[650px]" />
                            :
                            <video src={image} muted controls={false} autoPlay loop className="w-full h-200"></video>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}