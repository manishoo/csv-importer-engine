import { EntityRepository, getConnection, Repository } from 'typeorm';

import { Product } from '../models/Product';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  public async createMany(products: Product[]): Promise<any> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(products)
      .execute();
  }
}
