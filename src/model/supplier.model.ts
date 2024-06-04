import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'; 

interface Cmsn {
    fltRt: number;
    cpiTp: number;
    revShr: number;
  }
  
 
  @Schema()
  export class Supplier extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true }) 
    _id: string;
  
    @Prop({ type: Object, required: true })
    cmsn: Cmsn;
  
    @Prop({ type: [String], required: true })
    cnt: string[];
  
    @Prop({ required: true })
    st: number;
  
    @Prop({ required: true })
    encTp: number;
  
    @Prop({ required: true })
    splr_nm: string;
  
    @Prop({ required: true })
    eml: string;
  
    @Prop({ required: true })
    scrtKey: string;
  
    @Prop({ required: true })
    sUrl: string;
    
  
    @Prop({ required: true })
    api_supp_chk: number;
  
    
  
    @Prop({ type: Date, required: true })
    crtd_on: Date;
  
    @Prop({ type: Date, required: true })
    mod_on: Date;
  
    @Prop({ required: true })
    __v: number;
  
    
  }
  
  export const SupplierSchema = SchemaFactory.createForClass(Supplier);
  