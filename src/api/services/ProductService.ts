import { parseString } from '@fast-csv/parse';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Product } from '../models/Product';
import { ProductRepository } from '../repositories/ProductRepository';
import { events } from '../subscribers/events';

@Service()
export class ProductService {

  constructor(
    @OrmRepository() private productRepository: ProductRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {
  }

  public find(): Promise<Product[]> {
    this.log.info('Find all products');
    return this.productRepository.find();
  }

  public findOne(id: string): Promise<Product | undefined> {
    this.log.info('Find one product');
    return this.productRepository.findOne({ id });
  }

  public async create(product: Product): Promise<Product> {
    this.log.info('Create a new product => ', product.toString());
    product.id = uuid.v1();
    const newProduct = await this.productRepository.save(product);
    this.eventDispatcher.dispatch(events.product.created, newProduct);
    return newProduct;
  }

  public async createMany(products: Product[]): Promise<boolean> {
    this.log.info('Create many products => ');

    await this.productRepository.save(products.map(product => ({
      id: uuid.v1(),
      ...product,
    })));

    return true;
  }

  public update(id: string, product: Product): Promise<Product> {
    this.log.info('Update a product');
    product.id = id;
    return this.productRepository.save(product);
  }

  public async delete(id: string): Promise<void> {
    this.log.info('Delete a product');
    await this.productRepository.delete(id);
    return;
  }

  public async parseCSV(csvFile: Express.Multer.File): Promise<any> {
    this.log.info('Parse products csv => ');

    parseString(String(csvFile.buffer), { headers: true })
      .on('error', error => console.error(error))
      .on('data', row => console.log(row))
      .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));

    // const newProduct = await this.productRepository.save(product);
    // this.eventDispatcher.dispatch(events.product.created, newProduct);
    // return newProduct;

    return new Promise<any>(resolve => resolve({}));
  }

}
