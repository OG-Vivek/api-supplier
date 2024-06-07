export class EntityLogModel {
    collectionName: string;
    dbName:string;
    operation: string; // Delete, Update, Insert
    fieldValues: any[];
    query?:any;
}