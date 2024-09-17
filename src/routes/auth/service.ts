import { IResponse } from "../../typings";
import { $http, $storage } from "../../utils";
import { IAccount } from "./typings";

class AuthApi {
  async login(data:IAccount){
   const res  = await $http.post<IResponse<{accessToken:string,refreshToken:string}>>("api/auth/login", data);
   $storage.token = res.data.data.accessToken;
   $storage.refreshToken = res.data.data.refreshToken;
   console.log(res.data.data);
   return res;
   
  }

  async register(data:IAccount){
    const res = await $http.post<IResponse<IAccount>>("api/auth/register", data);
    console.log(res.data.data);
    return res;
  }
}

export const authApi = new AuthApi();