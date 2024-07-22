import { ApiProperty } from '@nestjs/swagger';
import { Expose } from '@nestjs/class-transformer';

export class FileInfoVm {

    @ApiProperty()
    @Expose()
    length: number;

    @ApiProperty()
    @Expose()
    chunkSize: number;

    @ApiProperty()
    @Expose()
    filename: string;    

    @ApiProperty()
    @Expose()
    contentType: string;
}