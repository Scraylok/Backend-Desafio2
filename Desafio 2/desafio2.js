const fs = require('fs').promises;
const root = "./productos.json";


class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.id = Product.addId()
    }

    static addId(){
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }
}

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    addProduct = async(product) => {
        const read = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(read);
        const prodCode = data.map((prod) => prod.code);
        const prodExist = prodCode.includes(product.code); 
        if (prodExist) {
            return console.log (`El código ${product.code} ya existe. Ingrese uno diferente.`)
        } else if (Object.values(product).includes("") || Object.values(product).includes(null)) {
            return console.log("Todos los campos deben ser completados.");
        } else {
            const nuevoProducto = {...product};
            data.push(nuevoProducto);
            await fs.writeFile(this.path, JSON.stringify(data), 'utf-8')
            
            return console.log(`El producto con id: ${nuevoProducto.id} ha sido agregado.`)
        }
    }

    getProducts = async () => {
        const read = await fs.readFile(this.path, 'utf-8')
        const data = JSON.parse(read)
        if (data.length != 0) {
            console.log("Listado completo de productos:");
            console.log(data);
        } else {
            console.log ("No se encuentran productos en el listado.")
        }
    }

    getProductById = async (id) => {
        const read = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(read);
        const findProduct = data.find((prod) => prod.id === id);
        if (findProduct) {
            console.log("Se ha encontrado el siguiente producto:")
            return console.log(findProduct);
        } else {
            return console.log("El producto no fue encontrado.");
        }
    }

    async deleteProduct(id) {
        const read = await fs.readFile(this.path, "utf-8");
        const data = JSON.parse(read);
        const productDeleted = JSON.stringify(
        data.find((product) => product.id === id)
        );
        const newData = data.filter((product) => product.id !== id);
        await fs.writeFile(this.path, JSON.stringify(newData), "utf-8");
        return console.log(
        `El producto ${productDeleted} ha sido eliminado.`
        );
    }

    async updateProduct(id, entry, value) {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            const index = data.findIndex((product) => product.id === id);
            if(!data[index][entry]){
                return console.log("El producto no pudo ser actualizado.")
            } else {
                data[index][entry] = value;
                await fs.writeFile(this.path, JSON.stringify(data, null, 2));
                console.log("El producto se ha modificado:")
                return console.log(data[index]);
            }
            
    }
}


//TESTING
//Instanciamos productManager.
const productManager = new ProductManager(root); 



// Agregamos productos.
const remeraEsen = new Product("REMERA ESSENTIALS GIANT LOGO", "UNA REMERA CÓMODA PARA EL DÍA A DÍA", 9.99, "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b91010638e534e3fac2bae8c0117bba3_9366/Remera_Essentials_Giant_Logo_Verde_HL2218_21_model.jpg","#01" ,50);
const ZaparillasHoops = new Product("ZAPATILLAS HOOPS 2.0 MID", "ZAPATILLAS INSPIRADAS EN EL BÁSQUET CON UN LOOK CLÁSICO", 22.99, "https://assets.adidas.com/images/w_600,f_auto,q_auto/82a1af0fc4b547819925ac0200ed9388_9366/Zapatillas_Hoops_2.0_Mid_Blanco_FY8617.jpg","#02", 10);
const zapatillasDuramo = new Product("ZAPATILLAS DURAMO SL 2.0", "ZAPATILLAS DE RUNNING PARA TU DÍA A DÍA HECHAS PARCIALMENTE CON MATERIALES RECICLADOS", 25.99, "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/66ef8bd4315f4457a967af480092910f_9366/Zapatillas_Duramo_SL_2.0_Negro_HP2376_01_standard.jpg","#03", 7);
const shortsAero = new Product("SHORTS AEROREADY", "SHORTS DEPORTIVOS PARA TUS SESIONES DIARIAS DE ENTRENAMIENTO", 12.99, "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0615b1ab673c411f9d05ab2800011581_9366/Shorts_AEROREADY_Gris_GL4383_02_laydown_hover.jpg","#04", 15);

const test = async() => {
    //Creamos archivo JSON.
    //await nuevoJson(ruta);
    // Listamos array de productos, que debería estar vacío.
    await productManager.getProducts(); 
    await productManager.addProduct(remeraEsen);
    await productManager.addProduct(ZaparillasHoops);
    await productManager.addProduct(zapatillasDuramo);
    await productManager.addProduct(shortsAero);
}

test()