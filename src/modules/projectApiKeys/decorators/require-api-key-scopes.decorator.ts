import { SetMetadata } from '@nestjs/common';
import { API_KEY_SCOPES_KEY } from '../constants';

export const RequireApiKeyScopes = (...scopes: string[]) => SetMetadata(API_KEY_SCOPES_KEY, scopes);
