const fs = require('fs');

class ProductManager {
  //variable this.path, el cual se inicializará desde el constructor
  constructor(filePath) {
    this.path = filePath;
    this.products = this.readProductsFromFile();
  }

  readProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error) {
      return [];
    }
  }

  writeProductsToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf-8');
  }

  //método addProduct el cual recibe un objeto con el formato previamente especificado 
  //y le asiga un id autoincrementable y lo guarda en el arreglo
  addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;

    if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
      console.log("Error: Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some((p) => p.code === code)) {
      console.log("Error: El código del producto ya existe.");
      return;
    }
    //guardar objetos con el formato
    const newProduct = {
      id: this.getNextProductId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.writeProductsToFile(this.products);
    console.log("Producto agregado satisfactoriamente.");
  }

  //método getProducts, el cual lee el archivo de productos y devuelve todos los productos en formato de arreglo.
  getProducts() {
    return this.products;
  }

  //método getProductById,el cual recibe un id, y tras leer el archivo, busca el producto con el
  //id especificado y devuelve en formato objeto
  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      console.log("Error: Producto no encontrado.");
      return null;
    }
  }
  //metodo updateProduct, el cual recibe el id del producto a actualizar 
  //y actualiza el producto que tenga ese id en el archivo.
  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((p) => p.id === id);

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.writeProductsToFile(this.products);
      console.log("Producto actualizado satisfactoriamente.");
    } else {
      console.log("Error: Producto no encontrado.");
    }
  }

  //método deleteProduct, el cual recibeun id y elimina el producto que tenga ese id en el archivo.
  deleteProduct(id) {
    const updatedProducts = this.products.filter((p) => p.id !== id);

    if (updatedProducts.length < this.products.length) {
      this.writeProductsToFile(updatedProducts);
      console.log("Producto eliminado satisfactoriamente.");
    } else {
      console.log("Error: Producto no encontrado.");
    }
  }

  getNextProductId() {
    return this.products.length > 0 ? Math.max(...this.products.map((p) => p.id)) + 1 : 1;
  }
}

module.exports = ProductManager;
