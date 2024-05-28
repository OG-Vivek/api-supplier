import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class DeleteGlobalRedirectURLs {
  @IsNotEmpty()
  @IsUrl()
  oUrl: string;

  @IsNotEmpty()
  @IsUrl()
  qTUrl: string;

  @IsNotEmpty()
  @IsUrl()
  tUrl: string;

  @IsNotEmpty()
  @IsString()
  pstbck: string; 

  @IsNotEmpty()
  @IsString()
  pstBckSuccessMethod: string;

  @IsNotEmpty()
  @IsString()
  pstbck_fail: string; 
  
  @IsNotEmpty()
  @IsString()
  pstBckFailMethod: string;

  @IsNotEmpty()
  @IsUrl()
  cmplVerificationNotifyURL: string;

  @IsNotEmpty()
  @IsString()
  cmplVerificationNotifyMethod: string;
}
