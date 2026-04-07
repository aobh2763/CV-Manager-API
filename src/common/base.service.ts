import { ObjectLiteral, Repository } from 'typeorm';

export class BaseService<T extends ObjectLiteral> {
  constructor(private readonly repo: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<T | null> {
    return this.repo.findOneBy({ id } as any);
  }
  
  async create(data: Partial<T>): Promise<T> {
  const entity = this.repo.create(data as T);
  return this.repo.save(entity);
}

  async update(id: number, data: Partial<T>): Promise<T | null> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}