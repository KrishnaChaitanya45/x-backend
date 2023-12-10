import { v2 } from 'cloudinary';
const CLOUDINARY = 'Cloudinary';
export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'ddnov4rnh',
      api_key: '315644928565939',
      api_secret: 'MCwddUKhDMN3XAxzvfYKQ46UM7c',
    });
  },
};
