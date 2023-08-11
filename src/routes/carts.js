import { Router } from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
    await cartManager.addCart();

    res.send({ status: "success" });
});

router.get("/:cid", async (req, res) => {
    const cid = +req.params.cid;
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
        res.send({
            status: "error",
            message: `No existe el carrito con el id ${cid}`,
        });
        return;
    }

    res.send(cart.products);
});

router.post("/:cid/product/:pid", async (req, res) => {
    const pid = +req.params.pid;
    const cid = +req.params.cid;
    const product = await productManager.getProductById(pid);
    const cart = await cartManager.getCartById(cid);

    if (!product) {
        res.send({
            status: "error",
            message: `No existe el producto con el id ${pid}`,
        });
        return;
    }

    if (!cart) {
        res.send({
            status: "error",
            message: `No existe el carrito con el id ${cid}`,
        });
        return;
    }
    await cartManager.addProductToCart(cid, pid);

    res.send({ status: "success" });
});

export default router;
