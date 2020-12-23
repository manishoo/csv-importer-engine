import { IsNotEmpty, IsUUID } from 'class-validator';
import { Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ProductNotFoundError } from '../errors/ProductNotFoundError';
import { Product } from '../models/Product';
import { ProductService } from '../services/ProductService';

class BaseProduct {
  @IsNotEmpty()
  public title: string;

  @IsNotEmpty()
  public code: string;

  @IsNotEmpty()
  public sku: string;

  public description: string;
}

export class ProductResponse extends BaseProduct {
  @IsUUID()
  public id: string;
}

class CreateProductBody extends BaseProduct {
  //
}

class CreateManyProductBody {
  public products: BaseProduct[];
}

// @Authorized()
@JsonController('/products')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class ProductController {

  constructor(
    private productService: ProductService
  ) {
  }

  @Get()
  @ResponseSchema(ProductResponse, { isArray: true })
  public find(): Promise<Product[]> {
    return this.productService.find();
  }

  @Get('/me')
  @ResponseSchema(ProductResponse, { isArray: true })
  public findMe(@Req() req: any): Promise<Product[]> {
    return req.product;
  }

  @Get('/:id')
  @OnUndefined(ProductNotFoundError)
  @ResponseSchema(ProductResponse)
  public one(@Param('id') id: string): Promise<Product | undefined> {
    return this.productService.findOne(id);
  }

  @Post()
  @ResponseSchema(ProductResponse)
  public create(@Body() body: CreateProductBody): Promise<Product> {
    const product = new Product();
    product.title = body.title;
    product.code = body.code;
    product.sku = body.sku;
    product.description = body.description;

    return this.productService.create(product);
  }

  @Post('/create-many')
  @ResponseSchema(ProductResponse)
  public createMany(@Body() body: CreateManyProductBody): Promise<boolean> {
    const products: Product[] = [];

    body.products.map(productInput => {
      const product = new Product();
      product.title = productInput.title;
      product.code = productInput.code;
      product.sku = productInput.sku;
      product.description = productInput.description;

      products.push(product);
    });

    return this.productService.createMany(products);
  }

  @Put('/:id')
  @ResponseSchema(ProductResponse)
  public update(@Param('id') id: string, @Body() body: BaseProduct): Promise<Product> {
    const product = new Product();
    product.title = body.title;
    product.code = body.code;
    product.sku = body.sku;
    product.description = body.description;

    return this.productService.update(id, product);
  }

  @Delete('/:id')
  public delete(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }
}
