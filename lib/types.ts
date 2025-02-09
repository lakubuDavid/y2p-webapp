export type User = {
  id:number,
  name:string,
  email:string
}

export type UserCredentials = {
  accessToken?:string,
  refreshToken?:string,
  user?:User
}
