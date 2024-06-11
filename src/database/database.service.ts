import { Injectable } from "@nestjs/common";
import { MongoRepository } from "./mongo.repository";
import { FindDataModel } from "../utils/find-data.model";
import { EntityLogModel } from "src/utils/entity-log.model";
import { CollectionNames } from "src/utils/enums";

@Injectable()
export class DataBaseService {
    private readonly dbName: string = process.env.dbName
    constructor(private mongoRepository: MongoRepository){}

    public async getById(findData: any) {
        try {
            let dbName: string = findData.dbName;
            let collectionName: string = findData.collectionName;
            let result = await this.mongoRepository.findById(dbName, collectionName, findData);
            return result;
        }
        catch (err) {
            return { error: err.message };
        }
    }

    public async findMany(data: FindDataModel){
        try {
            let dbName: string = data.dbName;
            let collectionName: string = data.collectionName;
            let result = await this.mongoRepository.find(dbName, collectionName, data.query);
            return result;
        }
        catch (err) {
            return { error: err.message };
        }
    }

    private resolveData(fieldValues: any[]) {
        let data: any = {};
        for (let item of fieldValues) {
            let keys = Object.keys(item);
            data[keys[0]] = item[keys[0]];
        }
        return data;
    }

    public async updateMany(entityLog: EntityLogModel) {
        try {
            let result:any = [];
            let dbName: string = entityLog.dbName;
            let collectionName: string = entityLog.collectionName;
            let resolvedData = this.resolveData(entityLog.fieldValues);
            if(Object.keys(resolvedData)[0].startsWith("$")){
                await this.mongoRepository.updateMany(dbName, collectionName, entityLog.query, resolvedData);
                await this.addEntityLog(dbName, CollectionNames.Audit, entityLog);
            }else{
                result = await this.mongoRepository.updateMany(dbName, collectionName, entityLog.query, {$set : resolvedData});
                await this.addEntityLog(dbName, CollectionNames.Audit, entityLog);
            }
            return result;
            return { message: `Entities updated from ${dbName} in collection ${collectionName}` };
        }
        catch (err) {
            return { error: err.stack };
        }
    }

    private async addEntityLog(dbName: string, collectionName: string, entityLog: EntityLogModel) {
        let data = {
            coln:entityLog.collectionName,
            data: Object.assign({}, ...entityLog.fieldValues),
            cond:"",
            action:'UPDATE',
            userId:'',
            userType: 'Supplier',
            crtd_on: new Date
        }
        let logData = await this.mongoRepository.insert(dbName, collectionName, data);
        return logData;
        return ;
    }


}