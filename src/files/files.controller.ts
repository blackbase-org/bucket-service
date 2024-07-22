import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileResponse } from '../interface/file.response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('file')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('file'))
  public async uploadFiles(@UploadedFiles() files): Promise<FileResponse> {
    console.log(files);
    Logger.log('Done');
    let result: FileResponse;

    if (files) {
      Logger.log('oui');
      try {
        const response = [];
        files.forEach((file) => {
          const fileReponse = {
            originalname: file.originalname,
            encoding: file.encoding,
            mimetype: file.mimetype,
            id: file.id,
            filename: file.filename,
            metadata: file.metadata,
            bucketName: file.bucketName,
            chunkSize: file.chunkSize,
            size: file.size,
            md5: file.md5,
            uploadDate: file.uploadDate,
            contentType: file.contentType,
            url: process.env.BASE_URL + file.id,
          };
          response.push(fileReponse);
        });

        result = {
          status: HttpStatus.OK,
          message: 'File(s)_successfully_upload',
          data: response,
        };
      } catch (error) {
        result = {
          status: HttpStatus.EXPECTATION_FAILED,
          message: 'Fail_to_upload_file(s)',
          data: null,
        };
      }

      return result;
    } else {
      Logger.log('non');
      throw new HttpException('Invalid_file(s)', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('infos/:id')
  public async getFileInfos(@Param('id') id: string) {
    let result: FileResponse;
    if (!id) {
      throw new HttpException('Invalid_File_Id', HttpStatus.EXPECTATION_FAILED);
    }
    
    try {
      Logger.log(id);
      const file = await this.filesService.findInfo(id);

      Logger.log(file);
      const filestream = await this.filesService.readStream(id);
      if (!filestream) {
        throw new HttpException(
          'An error occurred while retrieving file',
          HttpStatus.EXPECTATION_FAILED,
        );
      }

      // Logger.log(file);

      result = {
        status: HttpStatus.OK,
        message: 'File_detected',
        data: { file },
      };
    } catch (error) {
      result = {
        status: HttpStatus.EXPECTATION_FAILED,
        message: 'Fail_to_retrieve_file_info' + error,
        data: null,
      };
    }

    return result;
  }

  @Get(':id')
  public async readFile(
    @Param('id') id: string, @Res() res
  ): Promise<FileResponse> {
    let result: FileResponse;
    Logger.log('download');
    if (!id) {
      throw new UnauthorizedException('Invalid File Id');
    }

    try {
      const file = await this.filesService.findInfo(id);

      Logger.log(file);
      const filestream = await this.filesService.readStream(id);

      Logger.log(filestream);
      if (!filestream) {
        throw new HttpException(
          'An error occurred while retrieving file',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      res.header('Content-Type', file.contentType);
      res.header('Content-Disposition', 'attachment; filename=' + file.filename);

      return filestream.pipe(res);
    } catch (error) {
      Logger.log(error);
      result = {
        status: HttpStatus.EXPECTATION_FAILED,
        message: 'Fail_to_get_file_info',
        data: null,
      };
    }

    return result;
  }

  @Delete(':id')
  async downloadFile( @Param('id') id: string): Promise<FileResponse> {
    let result: FileResponse;

    try {
      const file = await this.filesService.findInfo(id);
      const filestream = await this.filesService.deleteFile(id);
      if (!filestream) {
        throw new HttpException(
          'An error occurred during file deletion',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      result = {
        status: HttpStatus.OK,
        message: 'File_has_been_deleted',
        data: file,
      };
    } catch (error) {
      result = {
        status: HttpStatus.EXPECTATION_FAILED,
        message: 'Fail_to_delete_file',
        data: null,
      };
    }

    return result;
  }
}
