import { Inject, Injectable } from '@nestjs/common';
import { DeleteGlobalRedirectURLs } from './DTOs/delete-Global-Redirect-URLs';
import { SetRedirectUrls } from './DTOs/set-Global-Redirect-URLs.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supply } from 'src/model/supply.model';

@Injectable()
export class SupplyService {
  constructor(@InjectModel('Supply') private readonly supplyModel: Model<Supply>) {}


  async getQuestionsByCountryAndLanguage() {
    // return await this.supplyModel.getQuestionsByCountryAndLanguage();
  }

  async setRedirectUrls(data: SetRedirectUrls) {
    // return await this.supplyModel.setRedirectUrls(data);
  }

  async deleteGlobalRedirectURLs(data?: DeleteGlobalRedirectURLs) { 
    try {
      return ;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }
}
