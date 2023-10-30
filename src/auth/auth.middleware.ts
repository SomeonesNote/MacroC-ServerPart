import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import * as serviceAccount from './macroc-84754-firebase-adminsdk-n1n3t-18ec1eb2e7.json';
import * as config from 'config';

const dbconfig = config.get('db');
const firebaseParams = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private defaultApp: firebase.app.App;

  constructor() {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebaseParams),
      databaseURL: process.env.RDS_DB_NAME || dbconfig.database,
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) return res.status(401).end('access denied');

    const token = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await firebase.auth().verifyIdToken(token);
      req['uid'] = decodedToken.uid;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: 'Invalid token' });
    }
  }
}
