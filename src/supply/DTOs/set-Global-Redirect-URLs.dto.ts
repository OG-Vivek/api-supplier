import { IsNotEmpty, IsString, IsUrl,IsOptional, Validate } from 'class-validator';
 
export class SetRedirectUrls {

  constructor() {}

  // @IsNotEmpty()
    // @Validate(IsNonEmptyBody, { message: 'Request body must not be empty' })
    id:number;
  
    @IsOptional()
    @IsUrl()
    @IsString()
    sUrl: string;
  
    @IsOptional()
    @IsUrl()
    @IsString()
    fUrl: string;
  
    @IsOptional()
    @IsUrl()
    @IsString()
    oUrl: string;
  
    @IsOptional()
    @IsUrl()
    @IsString()
    qTUrl: string;
  
    @IsOptional()
    @IsUrl()
    @IsString()
    tUrl: string;
  
    @IsOptional()
    @IsUrl()
    @IsString()
    pstbck: string;
  
    @IsOptional()
    @IsUrl()
    @IsString()
    pstbck_fail: string;
    
} 
