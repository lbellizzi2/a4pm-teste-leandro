import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        profile: string;
        companyId: number;
      };
    }
  }
}