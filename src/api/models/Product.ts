import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {

  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @Column({ name: 'title' })
  public title: string;

  @IsNotEmpty()
  @Column({ name: 'code' })
  public code: string;

  @IsNotEmpty()
  @Column({ name: 'sku' })
  public sku: string;

  @IsNotEmpty()
  @Column({ name: 'description' })
  public description: string;

  public toString(): string {
    return `${this.id} ${this.title} (${this.code}-${this.sku})`;
  }

}
