import { GUEST_PERMS } from '@constants/permissions';
import { RoleTypes, Security } from '@middlewares/Security';
import express from 'express';
import { UserController } from './UserController';
import { validatePasswordChange, validatePasswordReset, validateUserSignin, validateUserSignup } from './validations';

const router = express.Router();

router.post('/auth/signup', validateUserSignup(), UserController.signup);

router.post('/auth/signin', validateUserSignin(), UserController.signin);

router.post( 
  '/auth/email/confirm',
  Security.requiresRolePermissions(RoleTypes.ROLE_GUEST, [GUEST_PERMS.VERIFY_EMAIL]),
  UserController.confirmEmail,
);

router.post('/auth/password/reset', validatePasswordReset(), UserController.requestPasswordReset);

router.post(
  '/auth/password/change',
  Security.requiresRolePermissions(RoleTypes.ROLE_GUEST, [GUEST_PERMS.CHANGE_PASSWORD]),
  validatePasswordChange(),
  UserController.requestPasswordChange,
);

export default router;
