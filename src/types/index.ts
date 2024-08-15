export namespace AuthTypes {
  export type GoogleProfile = {
    id: string;
    email: string;
    verified_email: boolean;
    picture: string;
  };

  export type JwtPayload = {
    id: string;
  };
}
