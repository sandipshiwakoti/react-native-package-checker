import axios from 'axios';

import { urls } from '@/config/urls';
import { PackageResponse } from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const checkPackages = async (packages: string[]) => {
  const infoResponse = await api.post<PackageResponse>(urls.packageInfo, { packages });

  return {
    packageInfo: infoResponse.data,
  };
};
