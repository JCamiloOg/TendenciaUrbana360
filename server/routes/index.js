import express from "express";
const router = express.Router();

import indexRouter from "./main.js";
import adminRouter from "./admin.js";
import clientRouter from "./clients.js";
import productsRouter from "./products.js";

router.use("/", indexRouter);
router.use("/products", productsRouter);
router.use("/clientes", clientRouter);
router.use("/admin", adminRouter);

export default router;