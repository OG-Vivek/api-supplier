import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Db, ObjectId } from 'mongodb';
import { Model } from "mongoose";
import { User } from "src/model/user.model";

@Injectable()
export class CommonService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async getAllCountries(){
        // this.countries.findAll();
    }

    async createNewUser(userRegistration: any) {
        if (userRegistration.password !== userRegistration.confirmPassword) {
          return {
            status: 422,
            data: {},
            message: 'Password does not match confirm password',
          };
        }
        try {
    
          delete userRegistration.confirmPassword;
          return await this.userModel.create(userRegistration);
        
        } catch (err) {
          console.log(err)
          throw new InternalServerErrorException(err);
        }
      }
}