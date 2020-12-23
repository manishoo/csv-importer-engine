import { HttpError } from 'routing-controllers';

export class ProductNotFoundError extends HttpError {
    constructor() {
        super(404, 'Product not found!');
    }
}
