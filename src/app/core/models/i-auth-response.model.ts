import { IUser } from './i-user.model';

export interface IAuthResponse {
  message: string;
  token: string;
  user: IUser;
}
