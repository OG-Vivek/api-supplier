import { Inject, Injectable, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { DeleteGlobalRedirectURLs } from './DTOs/delete-Global-Redirect-URLs';
import { SetRedirectUrls } from './DTOs/set-Global-Redirect-URLs.dto';
import { deviceTypes, qTypeMapping } from 'src/constant/constant';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DataBaseService } from 'src/database/database.service';
import { CategoryTypes, CollectionNames, Database, DeviceTypes, Operation } from 'src/utils/enums';
import { query } from 'express';

@Injectable()
export class SupplyService {
  private readonly dbName: string = process.env.dbName
  constructor(
    private readonly dbService: DataBaseService 
  ) { }

  @CacheKey('cached_questions')
  @CacheTTL(1)
  async getQuestionsByCountryAndLanguage(countryKey: string, language: string): Promise<any> {
    try {
      const dataForLocalizations = {
        dbName: Database.dbName,
        collectionName: 'localizations',
        query: {
          filter: {
            cnt: countryKey,
            lang: language,
          },
          projection: {
            "_id": 0,
            "qId": 1,
            "qText": 1,
          },
        },
      };

      const localizationDocuments: any = await this.dbService.findMany(dataForLocalizations);
      console.log("Total match in localizatins", localizationDocuments.length);

      if (!localizationDocuments.length) {
        throw new HttpException('No questions found for the given country and language', HttpStatus.NOT_FOUND);
      }

      const qIds = localizationDocuments.map(doc => doc.qId);

      const dataForQuestions = {
        dbName: Database.dbName,
        collectionName: 'questions',
        query: {
          filter: {
            id: { $in: qIds },
          },
        },
      };

      const questionDocuments: any = await this.dbService.findMany(dataForQuestions);
      console.log("Total match in questions", questionDocuments.length);

      if (!questionDocuments.length) {
        throw new HttpException('No questions found for the given country and language', HttpStatus.NOT_FOUND);
      }

      const questionTextMap = new Map();
      localizationDocuments.forEach(doc => {
        questionTextMap.set(doc.qId, doc.qText);
      });

      const result = questionDocuments.map(doc => ({
        questionId: doc.id,
        questionText: questionTextMap.get(doc.id),
        questionKey: doc.qKey,
        questionType: qTypeMapping[doc.qType] || "Unknown",
        language: language,
        questionCategory: doc.cat.map(category => category.name)

      }));

      return {
        apiStatus: "success",
        msg: "Questions are successfully fetched",
        result: result,
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
    const supplierData = {
      dbName: Database.dbName,
      collectionName: 'suppliers',
      query: {
        filter: {
          id: id,
        },
        projection: { 
          _id:0,
        }
      },
    };

    const user: any = await this.dbService.findMany(supplierData);
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
      throw new HttpException("Supplier not found", HttpStatus.NOT_FOUND);
    }

    const supplier = user[0];

    urlMappings.forEach(mapping => {
      if (mapping.value) {
        supplier[mapping.key] = mapping.value;
      }
    });

    const updateData = {
      dbName: Database.dbName,
      collectionName: 'suppliers',
      operation: Operation.Update,
      query: { 
          id: id,
      },
      fieldValues: [supplier]
    };

    const updateResponse = await this.dbService.updateMany(updateData);

    return {
      "apiStatus": "success",
      "msg": "Redirection Methods updated successfully"
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

  
  async getSupplier(supId){         //Get the details of of supplier 
    try {
      let query = {
        dbName:Database.dbName,
        collectionName:CollectionNames.Suppliers,
        query: {
          filter: { id: supId },
        }
      }
      let result = await this.dbService.findMany(query);
      return { "apiStatus": "success",msg:'Supplier Got Successfully',result}
    } catch (error) {
      console.error(error);
      throw NotFoundException;
    }
  }
  
  async getAllocatedSurveys(supIdToFind:number) {
    try {
      let prjStatsQuery = {
        dbName: Database.dbName,
        collectionName: CollectionNames.ProjectStats,
        query: {
          filter: {
            surveys: {
              $elemMatch: {
                st: { $in: [1] },
                sup: { $in: [supIdToFind] }
              }
            }
          },
          projection: { 
          }
        }
      }
      let response :any = await this.dbService.findMany(prjStatsQuery);

      let projectIds = [];
      let result = response.flatMap(entry => {
        const filteredSurveys = entry.surveys.filter(survey => 
          Array.isArray(survey.sup) && survey.sup.includes(supIdToFind)
        );
  
        // Add the project ID to the array if there are matching surveys
        if (filteredSurveys.length > 0) {
          projectIds.push(entry.id);
        }
        return filteredSurveys.map(survey => ({
          ...survey,
          projectId: entry.id
        }));
      });


      //Get project data from project collection
      const ProjectQuery: any = {
        dbName: Database.dbName,
        collectionName: CollectionNames.Projects,
        query: {
          filter: { id: { $in: projectIds } },
          projection: { 
            _id: 0,
            ct:1,
            id:1
          }
        }
      };
    
      const projectDatas:any = await this.dbService.findMany(ProjectQuery);
      const projectDataMap = new Map(projectDatas.map(project => [project.id, project]));

      //Get supplier details
      let supplier = await this.getSupplier(supIdToFind)
      
      //Get the array of survey ids to find corresponding surveys
      let surveyIdsToFind =[]
      await response.flatMap((entry => entry.surveys.map(survey => (
        surveyIdsToFind.push(survey.sur_id))
      )))

      //Query to find all surveys
      const surQuery: any = {
        dbName: Database.dbName,
        collectionName: CollectionNames.Surveys,
        query: {
          filter: { id: { $in: surveyIdsToFind } },
          projection: { 
            _id: 0,
            sur_num_enc: 1,
            id:1,
            mem_chk:1,
            trg:1,
            dvc:1
          }
        }
      };
    
      const surveyData:any = await this.dbService.findMany(surQuery);
      
      let lngIdsToFind =[]
      // Create a lookup map for surveys details (sur_num_enc and mem_chk) by id
      const surveyMap = new Map();
      surveyData.forEach(item => {
        surveyMap.set(item.id, {
          sur_num_enc: item.sur_num_enc,
          mem_chk: item.mem_chk,
          lngCode: item.trg.lng[0],
          deviceType: item.dvc
        });
        lngIdsToFind.push(item.trg.lng[0]); // Get the language code to find the language
      })

      //Find Language from Language collection
      const lngQuery: any = {
        dbName: Database.dbName,
        collectionName: CollectionNames.Languages,
        query: {
          filter: { id: { $in: lngIdsToFind } },
          projection: { 
            _id: 0,
            name:1,
            id:1
          }
        }
      };
      const LngDatas:any = await this.dbService.findMany(lngQuery)

      // Create a lookup map for language and languageCode
      const LngMapedData = new Map(LngDatas.map(item => [item.id, item.name]));

      // Add sur_num_enc to the result
      const resultWithEnc = result.map(survey =>{
        const surData = surveyMap.get(survey.sur_id);
        const project:any = projectDataMap.get(survey.projectId);
        return {
          survayId: survey.sur_id,
          survayName: survey.sur_nm,
          N:survey["sup"+supIdToFind].N,
          CPI:survey["sup"+supIdToFind].CPI,
          isRevShr:survey["sup"+supIdToFind].isRevShr ? true : false,
          supCmps:survey["sup"+supIdToFind].isRevShr ? supplier.result[0].cmsn.revShr: 0,
          remainingN: survey["sup"+supIdToFind].N - survey["sup"+supIdToFind].cmps,
          LOI: survey.LOI,
          IR:survey.IR,
          Country:survey.cnt.cnt_nm,
          Language:LngMapedData.get(surData.lngCode),
          reContact:surData.mem_chk ? true : false,
          liveUr: `http://ogmr-api.ongraph.com:4000/screener?survey=${surData.sur_num_enc}&supplierId=111&pid=`,
          testURL: `http://ogmr-api.ongraph.com:4000/screener?isTest=1&isLive=0&survey=${surData.sur_num_enc}&supplierId=111&pid=`,
          projectId:survey.projectId,
          deviceType:DeviceTypes[surData.deviceType],
          projectCategory: CategoryTypes[project.ct],
          createdDate:survey.crtd_on,
          modifiedDate:survey.mod_on,
          SupplierId: supIdToFind,
          isQuota:'',
          isPIIRequired:'',
          numberOfCompletes: '',
          numberOfStarts: '',
          globalBuyerConversion: '',
          globalMedianLOI: '',
        };
      });

      return {
        apiStatus: "success",
        msg: 'All live groups are successfully searched',
        result: resultWithEnc 
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async getAnswersByQuestionKey(questionKey: string, country: string, language: string) {
    try {
      const dataForLocalizations = {
        dbName: Database.dbName,
        collectionName: 'localizations',
        query: {
          filter: {
            qKey: questionKey,
            cnt: country,
            lang: language,
          },
          projection: {
            "_id": 0,
            "qId": 1,
            "qText": 1,
            "qOptions": 1,
          },
        },
      };

      const localizationDocuments: any = await this.dbService.findMany(dataForLocalizations);
      console.log("Total match in localizations ", localizationDocuments.length);

      if (!localizationDocuments.length) {
        throw new HttpException('No answers found', HttpStatus.NOT_FOUND);
      }

      const qIds = localizationDocuments.map(doc => doc.qId);

      const dataForQuestions = {
        dbName: Database.dbName,
        collectionName: 'questions',
        query: {
          filter: {
            id: { $in: qIds },
          },
        },
      };

      const questionDocuments: any = await this.dbService.findMany(dataForQuestions);
      console.log("Total match in questions ", questionDocuments.length);

      if (!questionDocuments.length) {
        throw new HttpException('No answers found', HttpStatus.NOT_FOUND);
      }

      const questionTextMap = new Map();
      const questionOptionsMap = new Map();
      localizationDocuments.forEach(doc => {
        questionTextMap.set(doc.qId, doc.qText);
        questionOptionsMap.set(doc.qId, doc.qOptions.map(opt => ({
          OptionText: opt.optText,
          id: opt.id,
          Order: opt.optSeq,
        })));
      });

      const result = questionDocuments.map(doc => ({
        questionKey: doc.qKey,
        questionId: doc.id,
        questionText: questionTextMap.get(doc.id),
        questionType: qTypeMapping[doc.qType] || "Unknown",
        questionCategory: doc.cat.map(category => category.name),
        questionOptions: questionOptionsMap.get(doc.id) || [],
      }));

      return {
        apiStatus: "success",
        msg: "Answers are successfully fetched",
        result: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('An error occurred while fetching options', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  async setRedirectionForSurvey(Data: SetRedirectUrls, surveyId: number) {
    try {
      const { id, sUrl, fUrl, qTUrl, oUrl, tUrl, pstbck, pstbck_fail } = Data;
      const supplierId = id;
      const supplierField = `sup${supplierId}`;

      const urlMappings = [
        { key: 'sUrl', value: sUrl },
        { key: 'fUrl', value: fUrl },
        { key: 'qTUrl', value: qTUrl },
        { key: 'oUrl', value: oUrl },
        { key: 'tUrl', value: tUrl },
        { key: 'pstbck', value: pstbck },
        { key: 'pstbck_fail', value: pstbck_fail },
      ];

      const data = {
        dbName: Database.dbName,
        collectionName: 'project_stats',
        query: {
          filter: {
            'surveys': {
              '$elemMatch': {
                'sur_id': surveyId,
                'sup': supplierId
              }
            }
          },
          projection: {
            "_id": 0,
            "surveys.$": 1
          }
        }
      };

      const response: any = await this.dbService.findMany(data);

      if (!response.length || !response[0].surveys.length) {
        throw new HttpException('No matching supplier field found', HttpStatus.NOT_FOUND);
      }

      const surveyToUpdate = response[0].surveys[0];

      if (!surveyToUpdate[supplierField]) {
        throw new HttpException('No matching supplier field found', HttpStatus.NOT_FOUND);
      }

      const result = surveyToUpdate[supplierField];

      urlMappings.forEach(mapping => {
        if (mapping.value) {
          result[mapping.key] = mapping.value;
        }
      });

      const updateData = {
        dbName: Database.dbName,
        collectionName: 'project_stats',
        operation: Operation.Update,
        query: {
          'surveys.sur_id': surveyId,
          'surveys.sup': supplierId
        },
        fieldValues: [{
          [`surveys.$.${supplierField}`]: result
        }]
      };

      const updateResponse = await this.dbService.updateMany(updateData);

      return { apiStatus: "success", msg: 'Redirection URLs updated successfully' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  
}
