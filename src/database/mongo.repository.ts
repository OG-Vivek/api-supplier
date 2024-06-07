import { Inject, Injectable } from '@nestjs/common';
import { Db, MongoClient, ObjectId } from 'mongodb';

@Injectable()
export class MongoRepository {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private client: MongoClient,
  ) {}

  public async findById(dbName: string, collectionName: string, id: string) {
    const db = this.client.db(dbName) ;
    const collection = db.collection(collectionName);
    let result = await collection.find({ _id: new ObjectId(id), }).toArray();
    return result[0];
  }

  public async find(dbName: string, collectionName: string, query: any) {
    const db = this.client.db(dbName);
    const collection = db.collection(collectionName);
  
    let page: number = query.page || 1;
    let limit: number = query.limit || 10; 
    let skip = (page - 1) * limit;
  
    let orderBy: any = {};
    let projection: any = query.projection || {};

    // Filter Building Logic
    let filter: any = {};
    if (query.filter) {
      filter = this.buildFilter(query.filter);
    }
  
    if (query.orFilter) {
      const orFilterConditions = query.orFilter.map(orCondition => this.buildFilter(orCondition));
      filter.$or = orFilterConditions;
    }

    if (query.searchFilter) {
      filter.$text = { $search: query.searchFilter };
    }
  
    if (query.rangeFilter) {
      for (const field in query.rangeFilter) {
        filter[field] = {
          $gte: query.rangeFilter[field].min,
          $lte: query.rangeFilter[field].max,
        };
      }
    }
 
    const count: number = await collection.countDocuments(filter);
    const data = await collection
      .find(query.filter, { projection })
      // .sort(orderBy)
      // .skip(skip)
      // .limit(limit)
      .toArray();    
      
    return data
  }
  
  
    private buildFilter(filterQuery: any): any {
      const filter: any = {};
      for (const field in filterQuery) {
        filter[field] = filterQuery[field];
      }
      return filter;
    }
  

  public async totalCount(collectionName: string, db: Db): Promise<number> {
    return await db.collection(collectionName).countDocuments();
  }


  public async updateMany(dbName: string, collectionName: string, query: any, updateData: any) {
    delete updateData._id;
    const db = this.client.db(dbName);
    const collection = db.collection(collectionName);
    return await collection.updateMany(query, updateData);
  }
  
  
  public async insert(dbName: string, collectionName: string, body: any) {
    const db = this.client.db(dbName);
    const collection = db.collection(collectionName);
    return await collection.insertOne(body);
  }



}
