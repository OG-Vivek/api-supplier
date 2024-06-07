import { Inject, Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { DeleteGlobalRedirectURLs } from './DTOs/delete-Global-Redirect-URLs';
import { SetRedirectUrls } from './DTOs/set-Global-Redirect-URLs.dto';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Supply } from 'src/model/supply.model';
import { Localization, Question } from 'src/model/questionLibrary.model'
import { qTypeMapping } from 'src/constant/constant';
import { Url  } from 'src/model/globalUrl.model';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DataBaseService } from 'src/database/database.service';
import { CollectionNames, Database, Operation } from 'src/utils/enums';

@Injectable()
export class SupplyService {
  private readonly dbName: string = process.env.dbName
  constructor(@InjectModel('Localization') private readonly localizationModel: Model<Localization>,
    @InjectModel('Question') private readonly questionModel: Model<Question>,
    @InjectModel('Url') private readonly globalUrlModel: Model<Url>,
    private readonly dbService: DataBaseService 
  ) { }

  @CacheKey('cached_questions') 
  @CacheTTL(1)
  async getQuestionsByCountryAndLanguage(countryKey: string, language: string): Promise<any> {
    try {
      const localizationDocuments = await this.localizationModel.find().exec();
      const questionDocuments = await this.questionModel.find().exec();

      // Match documents in localization collection based on countryKey and language
      const localizationPipeline = [
        {
          $match: {
            cnt: countryKey,
            lang: language,
          },
        },
        {
          $project: {
            qId: 1
          }
        }
      ];

      const matchedLocalizationDocuments = await this.localizationModel.aggregate(localizationPipeline).exec();

      if (matchedLocalizationDocuments.length === 0) {
        throw new HttpException('No questions found for the given country and language', HttpStatus.NOT_FOUND);
      }

      const qIds = matchedLocalizationDocuments.map(doc => doc.qId);

      const questionPipeline = [
        {
          $match: {
            id: { $in: qIds }
          }
        }
      ];

      const matchedQuestionDocuments = await this.questionModel.aggregate(questionPipeline).exec();

      if (matchedQuestionDocuments.length === 0) {
        throw new HttpException('No questions found for the given country and language', HttpStatus.NOT_FOUND);
      }

      const result = matchedQuestionDocuments.map(doc => ({
        questionId: doc.id,
        questionText: doc.qText,
        questionKey: doc.qKey,
        questionType: qTypeMapping[doc.qType] || "Unknown",
        language: language,
        questionCategory: doc.cat.map(category => category.name)
      }));

      return {
        apiStatus: "success",
        msg: "questions are successfully searched",
        result: result
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('An error occurred while fetching questions', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  async setRedirectUrls(data: SetRedirectUrls): Promise<any> {
    const { id, sUrl, fUrl, qTUrl, oUrl, tUrl, pstbck, pstbck_fail } = data;
    const user = await this.globalUrlModel.findOne({ id: id });
    const urlMappings = [
      { key: 'sUrl', value: sUrl },
      { key: 'fUrl', value: fUrl },
      { key: 'qTUrl', value: qTUrl },
      { key: 'oUrl', value: oUrl },
      { key: 'tUrl', value: tUrl },
      { key: 'pstbck', value: pstbck },
      { key: 'pstbck_fail', value: pstbck_fail },
    ];

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    console.log("User", user);

    urlMappings.forEach(mapping => {
      if (mapping.value) {
        user[mapping.key] = mapping.value;
      }
    });

    await user.save();

    return {
      "apiStatus": "success",
      "msg": "Redirection Methods updated successfully"
    }
  }

  async deleteGlobalRedirectURLs(data?: DeleteGlobalRedirectURLs) {
    try {
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllExchangeSup() {
    try {
      let data = {
        dbName:Database.dbName,
        collectionName:CollectionNames.Suppliers,
        query: {
          filter: { api_supp_chk: 1  },
        }
      }
      let result = await this.dbService.findMany(data);
      return { "apiStatus": "success",msg:'All live groups are successfully searched',result}
    } catch (error) {
      console.error(error);
      throw error;
    }
  }  
  
  async getAllocatedSurveys(supIdToFind:number) {
    try {
      let data = {
        dbName: Database.dbName,
        collectionName: 'project_stats',
        query: {
          filter: {
            surveys: {
              $elemMatch: {
                st: { $in: [0] },
                sup: { $in: [supIdToFind] }
              }
            }
          },
          projection: { 
            "_id": 0,
            "surveys.sur_nm": 1,
            "surveys.sur_id": 1,
            "surveys.st": 1,
            "surveys.color": 1,
            "surveys.N": 1,
            "surveys.qt": 1,
            "surveys.sup_cpi": 1,
            "surveys.sur_rw": 1,
            "surveys.sur_rev": 1,
            "surveys.oq": 1,
            "surveys.fls": 1,
            "surveys.clks": 1,
            "surveys.cmps": 1,
            "surveys.shw_surv_dash": 1,
            "surveys.cmp_alt": 1,
            "surveys.availUrlCnt": 1,
            "surveys.url_typ": 1,
            "surveys.allw_dpl_clks": 1,
            "surveys.cmp_id": 1,
            "surveys.crtd_by": 1,
            "surveys.crtd_on": 1,
            "surveys.IR": 1,
            "surveys.LOI": 1,
            "surveys.from_quote": 1,
            "surveys.is_feas_id": 1,
            "surveys.cnt": 1,
            "surveys.CPI": 1,
            "surveys.act_rw": 1,
            "surveys.trsld_LOI": 1,
            "surveys.trsld_IR": 1,
            "surveys.alert_msg": 1,
            "surveys.mod_by": 1,
            "surveys.mod_on": 1,
            "surveys.mod_on_saved": 1,
            "surveys.isLiveFromCron": 1,
            "surveys.live_dt": 1,
          }
        }
      }
      let response :any = await this.dbService.findMany(data);
      let result = await response.flatMap(entry => entry.surveys);
      return { "apiStatus": "success",msg:'All live groups are successfully searched',result}
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
