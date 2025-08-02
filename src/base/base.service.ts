import { InternalServerErrorException } from '@nestjs/common';
import { Model, Document } from 'mongoose';

export class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async checkExists(id: string): Promise<boolean> {
    try {
      return (await this.model.exists({ _id: id })) ? true : false;
    } catch (error) {
      throw new InternalServerErrorException(`Error checking existence: ${error.message}`);
    }
  }

  async getById(id: string): Promise<T> {
    try {
      const document = await this.model.findById(id);
      if (!document) {
        return undefined;
      }
      return document;
    } catch (error) {
      throw new InternalServerErrorException(`Error retrieving document: ${error.message}`);
    }
  }
}
