import express from "express";
const router = express.Router();

import indexRouter from "./main.js";
import adminRouter from "./admin.js";
import clientRouter from "./clients.js";
import productsRouter from "./products.js";

router.use("/api/", indexRouter);
router.use("/api/products", productsRouter);
router.use("/api/clientes", clientRouter);
router.use("/api/admin", adminRouter);

export default router;