import fs from "fs";
import path from "path";
import __dirname from "./utils.js";

export default class ProductManager {
    constructor() {
        this.path = path.join(__dirname, "./products.json");
        this.products = [];
        this.readJson();
    }

    readJson = async () => {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, "utf-8");
            this.products = JSON.parse(data);
        }
    };

    saveJson = async () => {
        const data = JSON.stringify(this.products, null, 4);
        fs.writeFileSync(this.path, data);
    };

    addProduct = async (
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        status,
        category
    ) => {
        const result = {
            success: false,
            message: "",
        };

        if (
            !title ||
            !description ||
            !price ||
            !code ||
            !stock ||
            !status ||
            !category
        ) {
            result.message = "Todos los campos son obligatorios";
            return result;
        }
        if (this.products.some((product) => product.code === code)) {
            result.message = "El codigo ya está en uso";
            return result;
        }
        thumbnails = thumbnails || "Sin Imagen";
        status = status || true;

        const product = {
            id: null,
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            status,
            category,
        };
        if (this.products.length === 0) {
            product.id = 1;
        } else {
            product.id = this.products[this.products.length - 1].id + 1;
        }
        this.products.push(product);
        await this.saveJson();
        result.success = true;
        result.product = product;
        return result;
    };

    getProducts = async () => {
        return this.products;
    };

    getProductById = async (id) => {
        const product = this.products.find((product) => product.id === id);
        return product;
    };

    updateProduct = async (id, productoActualizado) => {
        const index = this.products.findIndex((product) => product.id === id);
        this.products[index] = {
            ...this.products[index],
            ...productoActualizado,
        };
        await this.saveJson();
    };

    deleteProduct = async (id) => {
        const index = this.products.findIndex((product) => product.id === id);
        this.products.splice(index, 1);
        await this.saveJson();
    };
}
