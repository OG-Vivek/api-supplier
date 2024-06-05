import { IsNotEmpty, IsString, IsUrl,IsOptional, ValidateIf } from 'class-validator';
 
export class SetRedirectUrls {

  constructor() {}

    @IsOptional()
    id:number;

    @ValidateIf((o) => o.sUrl !== null)
    @IsOptional()
    @IsUrl()
    @IsString()
    sUrl: string;
  
    @ValidateIf((o) => o.fUrl !== null)
    @IsOptional()
    @IsUrl()
    @IsString()
    fUrl: string;
  
    @ValidateIf((o) => o.oUrl !== null)
    @IsOptional()
    @IsUrl()
    @IsString()
    oUrl: string;
  
    @ValidateIf((o) => o.qTUrl !== null)
    @IsOptional()
    @IsUrl()
    @IsString()
    qTUrl: string;
  
    @ValidateIf((o) => o.tUrl !== null)
    @IsOptional()
    @IsUrl()
    @IsString()
    tUrl: string;
  
    @ValidateIf((o) => o.pstbck !== null)
    @IsOptional()
    @IsUrl()
    @IsString()
    pstbck: string;
  
    @ValidateIf((o) => o.pstbck_fail !== null)
    @IsOptional()
    @IsUrl()
    @IsString()
    pstbck_fail: string;
    
} 
