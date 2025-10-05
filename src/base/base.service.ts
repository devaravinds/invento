import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Base } from './base.entity';

export class BaseService<T extends Base> {
  constructor(protected readonly repository: Repository<T>) {}

  async checkExists(id: number): Promise<boolean> {
    try {
      return await this.repository.exists({ where: { id } as any });
    } catch (error) {
      throw new InternalServerErrorException(`Error checking existence: ${error.message}`);
    }
  }

  async getById(id: string): Promise<T> {
    try {
      const document = await this.repository.findOne({ where : { id } as any});
      if (!document) {
        return undefined;
      }
      return document;
    } catch (error) {
      throw new InternalServerErrorException(`Error retrieving document: ${error.message}`);
    }
  }
}
