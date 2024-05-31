import { Inject, Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { DeleteGlobalRedirectURLs } from './DTOs/delete-Global-Redirect-URLs';
import { SetRedirectUrls } from './DTOs/set-Global-Redirect-URLs.dto';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Supply } from 'src/model/supply.model';
import { Localization, Question } from 'src/model/questionLibrary.model'
import { qTypeMapping } from 'src/constant/constant';
import { Url  } from 'src/model/globalUrl.model';

@Injectable()
export class SupplyService {
  constructor(@InjectModel('Localization') private readonly localizationModel: Model<Localization>,
    @InjectModel('Question') private readonly questionModel: Model<Question>,
    @InjectModel('Url') private readonly globalUrlModel: Model<Url> ) { }


  async getQuestionsByCountryAndLanguage(countryKey: string, language: string): Promise<any> {
    try{
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

    console.log("Matched Localization: ", matchedLocalizationDocuments.length );

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

    console.log("Matched Questions: ", matchedQuestionDocuments.length);

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
  }catch (error) {
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

    if (!user) {
      throw new BadRequestException("Request body can't be null");
    }

    if(!data){

    }

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", user);

    if (sUrl) user.sUrl = sUrl;
    if (fUrl) user.fUrl = fUrl;
    if (qTUrl) user.qTUrl = qTUrl;
    if (oUrl) user.oUrl = oUrl;
    if (tUrl) user.tUrl = tUrl;
    if (pstbck) user.pstbck = pstbck;
    if (pstbck_fail) user.pstbck_fail = pstbck_fail;

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
}
