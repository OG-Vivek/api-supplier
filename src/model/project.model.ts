import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Country {
  @Prop()
  countryShortCode: string;

  @Prop()
  countryName: string;
}

@Schema()
export class Supplier {
  @Prop()
  N: number;

  @Prop()
  cpi: number;

  @Prop()
  supId: number;

  @Prop()
  supplierName: string;

  @Prop()
  status: number;

  @Prop()
  currency: string;

  @Prop()
  convFactor: number;

  @Prop()
  completes: number;

  @Prop()
  clicks: number;

  @Prop()
  fails: number;

  @Prop()
  OQ: number;
}

@Schema()
export class Survey {
  @Prop()
  surveyName: string;

  @Prop()
  surId: number;

  @Prop()
  status: number;

  @Prop({ required: false })
  color: string;

  @Prop()
  N: number;

  @Prop()
  qt: number;

  @Prop()
  surveyRewards: number;

  @Prop()
  surveyRevenue: number;

  @Prop()
  OQ: number;

  @Prop()
  fails: number;

  @Prop()
  clicks: number;

  @Prop()
  completes: number;

  @Prop()
  showsurvey: number;

  @Prop({ required: false })
  completeAlert: string;

  @Prop()
  duplicateClicks: number;

  @Prop()
  companyId: number;

  @Prop()
  createdBy: number;

  @Prop()
  creationDate: Date;

  @Prop()
  IR: number;

  @Prop()
  LOI: number;

  @Prop()
  fromQuote: boolean;

  @Prop()
  isFeasId: boolean;

  @Prop()
  country: Country;

  @Prop()
  CPI: number;

  @Prop()
  actualReward: number;

  @Prop({ required: false })
  alertMsg: string;

  @Prop()
  modifiedBy: number;

  @Prop()
  modifiedDate: Date;

  @Prop()
  modifiedDateOnSave: Date;

  @Prop()
  liveDate: Date;

  @Prop({ type: [{ type: Object, ref: Supplier }] })
  Sup: Supplier[];
}

@Schema()
export class Customer {
  @Prop()
  customerId: number;

  @Prop()
  cnm: string;
}

@Schema()
export class Company {
  @Prop()
  companyId: number;

  @Prop()
  companyName: string;
}

@Schema()
export class ProjectManager {
  @Prop()
  pId: number;

  @Prop()
  pnm: string;
}

@Schema()
export class Project extends Document {
  @Prop()
  customer: Customer;

  @Prop()
  company: Company;

  @Prop()
  prjMngr: ProjectManager;

  @Prop()
  status: number;

  @Prop()
  qt: number;

  @Prop()
  surveyStart: number;

  @Prop()
  fingerPrint: number;

  @Prop({ type: [{ type: Object, ref: Survey }] })
  surveys: Survey[];

  @Prop()
  approval_mail_sent: boolean;

  @Prop({ type: [String] })
  cltInvceEmails: string[];

  @Prop()
  currency: number;

  @Prop()
  closeByDate: Date;

  @Prop()
  projectName: string;

  @Prop()
  companyId: number;

  @Prop()
  createdBy: number;

  @Prop()
  clicks: number;

  @Prop()
  completes: number;

  @Prop()
  N: number;

  @Prop()
  OQ: number;

  @Prop()
  fails: number;

  @Prop({ required: false })
  lastClick: Date;

  @Prop()
  revenue: number;

  @Prop()
  rewards: number;

  @Prop()
  grossPrf: number;

  @Prop()
  grossPrfPer: number;

  @Prop()
  suppliers: number;

  @Prop()
  creationDate: Date;

  @Prop()
  modifiedDate: Date;

  @Prop({ type: [String] })
  clientInvoice: string[];

  @Prop({ type: [String] })
  supplierInvoice: string[];

  @Prop()
  projectCSAT: boolean;

  @Prop()
  csatEmail: string;

  @Prop()
  liveDate: Date;

  @Prop()
  modifiedBy: number;

  @Prop()
  custEml: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
