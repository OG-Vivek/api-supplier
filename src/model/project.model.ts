import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface Country {
  countryShortCode: string;
  countryName: string;
}


interface Supplier {
  N: number;
  cpi: number;
  supId: number;
  supplierName: string;
  status: number;
  currency: string;
  convFactor: number;
  completes: number;
  clicks: number;
  fails: number;
  OQ: number;
  surveyStart?: number; // Optional for when it's not always present
  cost?: number;       // Optional
  loi?: number;        // Optional
  medianLOI?: number;  // Optional
  qt?: number;        // Optional
}

interface Survey {
  surveyName: string;
  surId: number;
  status: number;
  color?: string;
  N: number;
  qt: number;
  surveyRewards: number;
  surveyRevenue: number;
  OQ: number;
  fails: number;
  clicks: number;
  completes: number;
  showsurvey: number;
  completeAlert?: string;
  duplicateClicks: number;
  companyId: number;
  createdBy: number; 
  creationDate: Date;
  IR: number;
  LOI: number;
  fromQuote: boolean;
  isFeasId: boolean;
  country: Country;
  CPI: number;
  actualReward: number;
  alertMsg?: string;
  modifiedBy: number;
  modifiedDate: Date;
  modifiedDateOnSave: Date;
  liveDate: Date;
  Sup: Supplier[];
  lastClickDate?: Date; // Optional
  surveyStart?: number; // Optional
  loi?: number;        // Optional
  lastCompleteDate?: Date; // Optional
  surveySupCpi?: number;  // Optional
  medianLOI?: number;   // Optional
}

interface Customer {
  customerId: number;
  cnm: string;
}

interface Company {
  companyId: number;
  companyName: string;
}

interface ProjectManager {
  pId: number;
  pnm: string;
}

export class Project extends Document  {
  @Prop({ type: Object })
  customer: Customer;

  @Prop({ type: Object })
  company: Company;

  @Prop({ type: Object })
  prjMngr: ProjectManager;

  @Prop()
  status: number;

  @Prop()
  qt: number;

  @Prop()
  surveyStart: number;

  @Prop()
  fingerPrint: number;

  @Prop({ type:Array })
  surveys: Survey[];

  @Prop()
  approval_mail_sent: boolean;

  @Prop()
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

  @Prop()
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

  @Prop()
  clientInvoice: string[];

  @Prop()
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
