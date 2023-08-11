import ProductManager from "../ProductManager.js";
import { Router } from "express";

const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    const limit = +req.query.limit;
    let result = products;

    if (limit) {
        result = products.slice(0, limit);
    }

    res.send(result);
});

router.get("/:pid", async (req, res) => {
    const pid = +req.params.pid;
    const product = await productManager.getProductById(pid);

    if (!product) {
        res.send({
            status: "error",
            message: `No existe el producto con el id ${pid}`,
        });
        return;
    }

    res.send(product);
});

router.post("/", async (req, res) => {
    const {
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        status,
        category,
    } = req.body;

    const validationResult = await productManager.addProduct(
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        status,
        category
    );

    if (!validationResult.success) {
        res.send({
            status: "error",
            message: validationResult.message,
        });
        return;
    }

    res.send({
        status: "success",
        message: `creado con el id: ${validationResult.product.id}`,
    });
});

router.put("/:pid", async (req, res) => {
    const pid = +req.params.pid;
    const product = await productManager.getProductById(pid);

    if (!product) {
        res.send({
            status: "error",
            message: `No existe el producto con el id ${pid}`,
        });
        return;
    }
    const updateProduct = req.body;
    await productManager.updateProduct(product.id, updateProduct);
    res.send({ status: "success" });
});

router.delete("/:pid", async (req, res) => {
    const pid = +req.params.pid;
    const product = await productManager.getProductById(pid);

    if (!product) {
        res.send({
            status: "error",
            message: `No existe el producto con el id ${pid}`,
        });
        return;
    }

    await productManager.deleteProduct(product.id);
    res.send({ status: "success" });
});

export default router;
