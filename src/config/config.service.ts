import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Injectable()
export class ConfigServices {
  constructor(private configService: ConfigService) {
    this.getPort();
    this.getDbConnectionString();
    this.getApiKey();
    this.getFrontendUrl();
    this.getJwtToken();
  }

  getDbConnectionString(): string {
    return this.configService.get<string>('mongoDb_url');
  }
  getPort(): string {
    return this.configService.get<string>('Port');
  }

  getFrontendUrl(): string {
    return this.configService.get<string>('Frontend_url');
  }

  getJwtToken(): string {
    return this.configService.get<string>('JWT_KEY');
  }

  getApiKey(): string {
    return this.configService.get<string>('Api_Key');
  }
}
