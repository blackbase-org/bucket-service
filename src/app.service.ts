import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';

@Injectable()
export class AppService {
  private fileModel: MongoGridFS;
  constructor(@InjectConnection() private connection: any) {
    this.fileModel = new MongoGridFS(
      this.connection.db,
      process.env.FILE_DB_NAME,
    );
  }
  async readStream(data: { id: string }): Promise<any> {
    return await this.fileModel.readFileStream(data.id);
  }
}
