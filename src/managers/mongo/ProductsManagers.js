import productModel from './models/product.model.js';

export default class ProductsManagers {
	
    getProducts() {
		return productModel.find({}).lean();
	};

    createProduct(product){ // Crea uno nuevo
        return productModel.create(product);
    };

    getProductById (pid) { // Busca solo uno
		return productModel.findOne({_id:pid}).lean(); 
	};

    deleteProduct(pid){ // elimina uno
        return productModel.deleteOne({_id: pid});
    };	

    updatedProduct(pid, updateData){ // edita uno
        return productModel.updateOne({ _id: pid }, { $set: updateData });
    };

};