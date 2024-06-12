import { Inject, Injectable, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { DeleteGlobalRedirectURLs } from './DTOs/delete-Global-Redirect-URLs';
import { SetRedirectUrls } from './DTOs/set-Global-Redirect-URLs.dto';
import { deviceTypes, qTypeMapping } from 'src/constant/constant';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DataBaseService } from 'src/database/database.service';
import { ProjectCategory, CollectionNames, Database, DeviceTypes, Operation } from 'src/utils/enums';
import { query } from 'express';

@Injectable()
export class SupplyService {
  private readonly dbName: string = process.env.dbName
  constructor(
    private readonly dbService: DataBaseService 
  ) { }

  async getQuestionsByCountryAndLanguage(countryKey: string, language: string): Promise<any> {
    try {
      const languageData = {
        dbName: Database.dbName,
        collectionName: 'languages',
        query: {
          filter: {
            name: language,
          },
          projection: {
            "_id": 0,
            "id": 1,
          },
        },
      };
      const langData: any = await this.dbService.findMany(languageData);
      console.log(langData);

      if (!langData || !langData.length) {
        throw new HttpException('Invalid language', HttpStatus.NOT_FOUND);
      }

      const langCode = langData[0].id.toString();
      console.log("Language code", langCode);

      const dataForQuestions = {
        dbName: Database.dbName,
        collectionName: 'qualification',
        query: {
          filter: {
            cnt: countryKey,
            lang: langCode
          },
        },
      };

      const questionDocuments: any = await this.dbService.findMany(dataForQuestions);
      console.log("Total match in questions", questionDocuments.length);

      if (!questionDocuments.length) {
        throw new HttpException('No questions found for the given country and language', HttpStatus.NOT_FOUND);
      }

      const result = questionDocuments.map(doc => ({
        questionId: doc.id,
        questionText: doc.qText,
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
  
  @CacheKey('Get_Allocated_Surveys') 
  async getAllocatedSurveys(supIdToFind:number) {
    supIdToFind = 116
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
          survey.st === 1 && Array.isArray(survey.sup) && survey.sup.includes(supIdToFind) && survey["sup" + supIdToFind].st === 1
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
      // let supplier = await this.getSupplier(supIdToFind)
      
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
            dvc:1,
            pii:1
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
          deviceType: item.dvc,
          pii:item.pii
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
            
      //Find Quota data of surveys
      const qtQuery: any = {
        dbName: Database.dbName,
        collectionName: CollectionNames.Quotas,
        query: {
          filter: { sur_id: { $in: surveyIdsToFind } },
          projection: { 
            _id: 0,
            name:1,
            sur_id:1
          }
        }
      };
      const QuataData:any = await this.dbService.findMany(qtQuery)
      // Create a lookup map for isQuata and sur_id
      const QutaMapedData = new Map(QuataData.map(item => [item.sur_id, true]));

      // Add sur_num_enc to the result
      const finlanResult = result.map(survey =>{
        const surData = surveyMap.get(survey.sur_id);
        const project:any = projectDataMap.get(survey.projectId);
        return {
          survayId: survey.sur_id,
          survayName: survey.sur_nm,
          N:survey["sup"+supIdToFind].N,
          CPI:survey["sup"+supIdToFind].CPI,
          isRevShr:survey["sup"+supIdToFind].isRevShr ? true : false,
          // supCmps:survey["sup"+supIdToFind].isRevShr ? supplier.result[0].cmsn.revShr: 0,
          supCmps:survey["sup"+supIdToFind].cost ? survey["sup"+supIdToFind].cost : 0,
          remainingN: survey["sup"+supIdToFind].N - survey["sup"+supIdToFind].cmps,
          LOI: survey.LOI,
          IR:survey.IR,
          Country:survey.cnt.cnt_nm,
          Language:LngMapedData.get(surData.lngCode),
          reContact:surData.mem_chk ? true : false,
          liveURL: `http://ogmr-api.ongraph.com:4000/screener?survey=${surData.sur_num_enc}&supplierId=${supIdToFind}&pid=`,
          testURL: `http://ogmr-api.ongraph.com:4000/screener?isTest=1&isLive=0&survey=${surData.sur_num_enc}&supplierId=${supIdToFind}&pid=`,
          projectId:survey.projectId,
          deviceType:DeviceTypes[surData.deviceType],
          projectCategory: ProjectCategory[project.ct],
          createdDate:survey.crtd_on,
          modifiedDate:survey.mod_on,
          isQuota: QutaMapedData.get(survey.sur_id) ? true : false,
          isPIIRequired: surData.pii ? true : false,
          numberOfCompletes: survey["sup"+supIdToFind].cmps ,
          numberOfStarts: survey["sup"+supIdToFind].surStart ? survey["sup"+supIdToFind].surStart : 0,
          globalBuyerConversion: '',
          globalMedianLOI: '',
        };
      });

      return {
        apiStatus: "success",
        msg: 'All active assigned surveys are successfully searched',
        result: finlanResult 
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async getAnswersByQuestionKey(questionKey: string, country: string, language: string) {
    try {
      const languageData = {
        dbName: Database.dbName,
        collectionName: 'languages',
        query: {
          filter: {
            name: language,
          },
          projection: {
            "_id": 0,
            "id": 1
          },
        },
      };

      const langData: any = await this.dbService.findMany(languageData);
      console.log(langData);

      if (!langData || !langData.length) {
        throw new HttpException('Invalid language', HttpStatus.NOT_FOUND);
      }

      const langCode = langData[0].id.toString();
      console.log("Language code", langCode);

      const dataForQuestions = {
        dbName: Database.dbName,
        collectionName: 'qualification',
        query: {
          filter: {
            lang: langCode,
            cnt: country,
            qKey: questionKey
          }
        },
      };

      const questionDocuments: any = await this.dbService.findMany(dataForQuestions);
      console.log("Total match in questions ", questionDocuments.length);

      if (!questionDocuments.length) {
        throw new HttpException('No answers found', HttpStatus.NOT_FOUND);
      }

      const result = questionDocuments.map(doc => ({
        questionKey: doc.qKey,
        questionId: doc.id,
        questionText: doc.qText,
        questionType: qTypeMapping[doc.qType] || "Unknown",
        questionCategory: doc.cat.map(category => category.name),
        questionOptions: doc.qOptions.map(opt => ({
          OptionText: opt.optText,
          id: opt.id,
          Order: opt.optSeq
        })),
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
