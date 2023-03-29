import bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';
import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { SigninRequestDto, SignupRequestDto, StatusDto, TokenDto, UserTypes } from '@typings/index';
import { CompaniesEntity, CompanyUserEntity } from './entities';
import { CandidatesEntity } from './entities/Candidates';
import { getConnection } from 'typeorm';
import { Logger } from '@helpers/Logger';
import { ServiceBridge } from '@modules/bridge';
import { Security, TokenTypes } from '@middlewares/Security';
import { GUEST_PERMS, USER_PERMS } from '@constants/permissions';
import { EMAIL_VERIFICATION_EXPIRY, TokenActionTypes, USER_TOKEN_EXPIRY } from './constants';
import { cleanObj, RequireAtLeastOne } from '@utils/index';

export const UserService = {
  async findUser(
    data: { id: string } | RequireAtLeastOne<{ type: UserTypes; email?: string; phoneNumber: string }, 'email' | 'phoneNumber'>,
  ): Promise<CandidatesEntity | CompanyUserEntity | undefined> {
    if ('id' in data) {
      const { id } = data;

      // prettier-ignore
      return await (id.startsWith('company-user-') ? CompanyUserEntity.findUser({
        where: {
          id,
        },
      }) : CandidatesEntity.findCandidate({
        where: {
          id: data.id,
        }
      }));
    } else if ('email' in data) {
      const { type, email, phoneNumber } = data;

      // prettier-ignore
      return await (type === UserTypes.COMPANY ? CompanyUserEntity.findUser({
        where: {
          $or: cleanObj({
            email,
            phoneNumber,
          }),
        },
      }) : CandidatesEntity.findCandidate({
        where: {
          $or: cleanObj({
            email,
            phoneNumber,
          }),
        }
      }));
    }

    return undefined;
  },

  async updateUser<T = CandidatesEntity | CompanyUserEntity>(
    data: Partial<T>,
    where: Partial<{ type?: UserTypes; id?: string } & T>,
  ): Promise<boolean> {
    const { type, id, ...restWhere } = where;

    if (type === UserTypes.COMPANY || (id && id.startsWith('company-user-'))) {
      return await CompanyUserEntity.updateUser(data, {
        where: cleanObj({
          id,
          ...restWhere,
        }),
      });
    } else if (type === UserTypes.CANDIDATE || (id && id.startsWith('candidate-'))) {
      return await CandidatesEntity.updateCandidate(data, {
        where: cleanObj({
          id,
          ...restWhere,
        }),
      });
    }

    return false;
  },

  async signup(data: SignupRequestDto): Promise<StatusDto> {
    const { type, firstName, lastName, email, phoneNumber, password } = data;

    // prettier-ignore
    const existingUser = await this.findUser({ type, email, phoneNumber });

    if (existingUser) {
      throw new CustomError(ErrorCode.BAD_REQUEST, `A user by that email ${phoneNumber ? 'or phone number' : ''} already exists`);
    }

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const id = uuid4();
    let userId;

    try {
      const passwordhash = await bcrypt.hash(password, 10);

      if (type === UserTypes.CANDIDATE) {
        userId = `candidate-${id}`;
        await queryRunner.manager.insert(CandidatesEntity, {
          id: userId,
          firstName,
          lastName,
          email,
          phoneNumber,
          password: passwordhash,
        });
      } else if (type === UserTypes.COMPANY) {
        const userId = `company-user-${id}`;

        await queryRunner.manager.insert(CompanyUserEntity, {
          id: userId,
          firstName,
          lastName,
          email,
          phoneNumber,
          password: passwordhash,
        });

        await queryRunner.manager.insert(CompaniesEntity, {
          id: `company-${uuid4()}`,
          ownerId: userId,
        });
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      Logger.Error('Unable to create account', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Account could not be created');
    } finally {
      await queryRunner.release();
    }

    const jwtSecurity = await Security.generateJWToken({
      tokenType: TokenTypes.GUEST,
      permissions: [GUEST_PERMS.VERIFY_EMAIL],
      data: {
        userId,
        userType: type,
        actionType: TokenActionTypes.EMAIL_VERIFICATION,
      },
      ttl: EMAIL_VERIFICATION_EXPIRY,
    });

    ServiceBridge.notifications
      .sendEmail({
        subject: 'Welcome to Distinct!',
        template: {
          id: type === UserTypes.COMPANY ? 'CompanyWelcomeEmail' : 'CandidateWelcomeEmail',
          params: {
            user: {
              firstName,
              lastName,
            },
            token: jwtSecurity.token,
          },
        },
        receivers: [
          {
            name: `${firstName} ${lastName}`,
            email,
          },
        ],
      })
      .catch(err => Logger.Error(`Unable to send welcome email to: ${email}`, err.message, err.stack));

    return {
      success: true,
      message: 'Account was created successfully',
    };
  },

  async signin(data: SigninRequestDto): Promise<TokenDto> {
    const { type, email, password } = data;

    // prettier-ignore
    const user = await this.findUser({ type, email });

    if (!user) {
      throw new CustomError(ErrorCode.RESOURCE_NOT_FOUND, 'Invalid email/password combination.');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new CustomError(ErrorCode.FORBIDDEN, 'Invalid email/password combination.');
    }

    // if (!user.confirmedEmail) {
    //   throw new CustomError(ErrorCode.BAD_REQUEST, 'Your email is not yet verified.');
    // }

    let company;

    if (type === UserTypes.COMPANY) {
      company = await CompaniesEntity.findCompany({
        where: {
          ownerId: user.id,
        },
      });

      if (!company) {
        throw new CustomError(ErrorCode.SERVICE_UNAVAILABLE, 'Your acccount is not linked to any company.');
      }
    }

    const jwtSecurity = await Security.generateJWToken({
      userId: type === UserTypes.COMPANY ? company?.id : user.id,
      tokenType: TokenTypes.USER,
      permissions: [USER_PERMS.FULL_LOGIN],
      ttl: USER_TOKEN_EXPIRY,
    });

    return {
      token: jwtSecurity.token,
      expiresIn: USER_TOKEN_EXPIRY,
    };
  },

  async confirmEmail(id: string, type: UserTypes): Promise<StatusDto> {
    const user = await this.findUser({ id });

    if (!user) {
      throw new CustomError(ErrorCode.FORBIDDEN, 'We could not find a user account matching your confirmation token');
    }

    if (user.confirmedEmail) {
      throw new CustomError(ErrorCode.FORBIDDEN, 'Email already confirmed.');
    }

    const update = await this.updateUser(
      {
        confirmedEmail: true,
      },
      {
        type,
        id: user.id,
      },
    );

    if (!update) {
      throw new CustomError(ErrorCode.FORBIDDEN, 'An error occurred. Your email could not be confirmed.');
    }

    return {
      success: true,
      message: 'Your email was confirmed successfully.',
    };
  },
};
