import api from './client';
import type { LoginDto, RegisterDto, AuthResponseDto } from '../types';

export const authApi = {
  register: (dto: RegisterDto) =>
    api.post<string>('/api/auth/register', dto).then((r) => r.data),

  login: (dto: LoginDto) =>
    api.post<AuthResponseDto>('/api/auth/login', dto).then((r) => r.data),
};
