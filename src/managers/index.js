import ProductsManagers from "./mongo/ProductsManagers.js";  // percistencia Mongo
import WritingsManagers from "./mongo/WritingsManagers.js";

export const productsService = new ProductsManagers(); // percistencia Mongo
export const writingsService = new WritingsManagers();