import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;

@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
  private gridFsStorage: typeof GridFsStorage;
  constructor() {
    const url = process.env.MONGODB_URI + process.env.FILE_DB_NAME;
    // console.log('db url', url);
    this.gridFsStorage = new GridFsStorage({
      url,
      file: (req, file) => {
        return new Promise((resolve) => {
          const filename = file.originalname.trim();
          const fileInfo = {
            filename: filename,
          };
          resolve(fileInfo);
        });
      },
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.gridFsStorage,
    };
  }
}
