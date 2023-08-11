import { Router } from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", (req, res) => {
    cartManager.addCart();

    res.send({ status: "success" });
});

router.get("/:cid", (req, res) => {
    const cid = +req.params.cid;
    const cart = cartManager.getCartById(cid);

    if (!cart) {
        res.send({
            status: "error",
            message: `No existe el carrito con el id ${cid}`,
        });
        return;
    }

    res.send(cart.products);
});

router.post("/:cid/product/:pid", (req, res) => {
    const pid = +req.params.pid;
    const cid = +req.params.cid;
    const product = productManager.getProductById(pid);
    const cart = cartManager.getCartById(cid);

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
    cartManager.addProductToCart(cid, pid);

    res.send({ status: "success" });
});

export default router;
