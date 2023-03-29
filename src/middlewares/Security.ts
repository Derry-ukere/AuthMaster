/* eslint-disable security/detect-object-injection */
import * as Jwt from 'jsonwebtoken';
import { Base64 } from 'js-base64';
import moment from 'moment';
import { NextFunction, RequestHandler, Request, Response } from 'express';
import { ErrorCode } from '@constants/ErrorCodes';
import { Logger } from '@helpers/Logger';

export enum RoleTypes {
  ROLE_USER = 'ROLE_USER',
  ROLE_GUEST = 'ROLE_GUEST',
}

export enum TokenTypes {
  USER = 'USER',
  GUEST = 'GUEST',
}

interface Auth {
  token: string;
  role: RoleTypes;
  permissions: string[];
  data?: { [x: string]: any };
}

interface ITokenDecoded {
  userId?: string;
  serviceId?: string;
  permissions: string[];
  tokenType: TokenTypes;
  data: {
    [x: string]: any;
  };
}

interface ITokenGen {
  tokenType: TokenTypes;
  userId?: string;
  permissions?: string[];
  data?: any;
  ttl?: number;
}

interface ITokenGenerated extends ITokenGen {
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface IExpressRequest extends Request {
  [x: string]: any;
  userId?: string;
  auth?: Auth;
}

const PERMS_USER_PREFIX = 'users.';
const PERMS_GUEST_PREFIX = 'guests.';
const HEADER_TOKEN_NAME = 'x-auth-token';
const JWT_ISSUER = 'SVCS/AUTH';

const assignRole = (tokenType: TokenTypes): RoleTypes => {
  switch (tokenType) {
    case TokenTypes.USER:
      return RoleTypes.ROLE_USER;
    default:
      return RoleTypes.ROLE_GUEST;
  }
};

const filterPermsByRole = (role: RoleTypes, permissions: string[]): string[] => {
  return permissions.filter(permission => {
    switch (role) {
      case RoleTypes.ROLE_USER:
        return permission.indexOf(PERMS_USER_PREFIX) === 0;
      case RoleTypes.ROLE_GUEST:
        return permission.indexOf(PERMS_GUEST_PREFIX) === 0;
      default:
        return false;
    }
  });
};

const checkPermissions = (requiredPermissions: string[], decodedPermissions: string[], requiresAll = true): boolean => {
  if (!decodedPermissions) {
    return false;
  }

  return requiresAll
    ? requiredPermissions.every(perm => decodedPermissions.includes(perm))
    : requiredPermissions.some(perm => decodedPermissions.includes(perm));
};

export const Security = {
  generateJWToken(options: ITokenGen): Promise<ITokenGenerated> {
    return new Promise((resolve, reject) => {
      const { tokenType, userId, permissions, data, ttl = 60 } = options;

      try {
        Jwt.sign(
          {
            userId,
            tokenType,
            permissions: permissions,
            data,
          },
          Base64.decode(process.env.SERVICE_JWT_SECRET as string),
          {
            algorithm: 'HS256',
            issuer: JWT_ISSUER,
            expiresIn: `${ttl}s`,
          },
          (err, token) => {
            if (err) {
              Logger.Error('TOKEN_SIGNING', err);

              reject({
                code: ErrorCode.SERVER_ERROR,
                message: 'Jwt signing failed.',
                data: err.stack,
              });
            }

            const createdAt = new Date();

            resolve({
              userId,
              token: token!,
              tokenType,
              permissions,
              createdAt,
              expiresAt: moment(createdAt)
                .add(ttl, 'seconds')
                .toDate(),
            });
          },
        );
      } catch (err) {
        Logger.Error('Unable to generate token', err.message, err.stack);
        reject({
          code: ErrorCode.SERVER_ERROR,
          message: 'Token generation failed.',
          data: err.stack,
        });
      }
    });
  },

  verifyJWToken(token: string): Promise<ITokenDecoded> {
    return new Promise((resolve, reject) => {
      try {
        Jwt.verify(
          token,
          Base64.decode(process.env.SERVICE_JWT_SECRET as string),
          {
            algorithms: ['HS256'],
            complete: true,
          },
          (err, decoded) => {
            if (err) {
              return reject({
                statusCode: 403,
                data: err,
              });
            }

            resolve(decoded?.payload as any);
          },
        );
      } catch (err) {
        reject(err);
      }
    });
  },

  requiresRolePermissions(role: RoleTypes, permissions: string[], requiresAllPermissions = true): RequestHandler {
    return (req: IExpressRequest, res: Response, next: NextFunction): Response | void => {
      // Auth token from headers
      const token = <string>req.headers[HEADER_TOKEN_NAME];

      // No API token provided
      if (!token) {
        return res.status(403).json({
          code: ErrorCode.FORBIDDEN,
          message: 'No API token provided',
        });
      }

      this.verifyJWToken(token)
        .then(
          async (decoded: ITokenDecoded): Promise<Response | void> => {
            const tokenType = decoded.tokenType;
            const roleType = assignRole(tokenType);

            req.auth = {
              token,
              // Assign a role (app, guest, service, user)
              role: roleType,
              // Decoded permissions
              permissions: filterPermsByRole(roleType, decoded.permissions),
            };

            // Check that role is defined and tokenType matches role
            if (!(role && role === req.auth.role)) {
              return res.status(403).json({
                code: ErrorCode.FORBIDDEN,
                message: 'Access without required permissions is forbidden',
              });
            }

            const hasPermissions = checkPermissions(permissions, req.auth.permissions, requiresAllPermissions);

            if (!hasPermissions) {
              return res.status(403).json({
                code: ErrorCode.FORBIDDEN,
                message: 'Access without required permissions is forbidden',
              });
            }

            req.auth.data = decoded.data;

            if (tokenType === TokenTypes.USER) {
              req.userId = decoded.userId;
            }

            if (![TokenTypes.USER, TokenTypes.GUEST].includes(tokenType)) {
              return res.status(403).json({
                code: ErrorCode.FORBIDDEN,
                message: 'Unrecognized token type',
              });
            }

            next();
          },
        )
        .catch(err => {
          const code = err.statusCode;

          if (err.data?.expiredAt) {
            res.status(403).json({
              code: ErrorCode.FORBIDDEN,
              message: 'Your token is expired',
            });
          } else if (code === 403) {
            res.status(code).json({
              code: ErrorCode.FORBIDDEN,
              message: 'Your token is invalid',
            });
          } else {
            res.status(500).json({
              code: ErrorCode.SERVER_ERROR,
              message: 'An unexpected server error occurred',
            });
          }
        });
    };
  },
};
