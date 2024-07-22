import { ApiProperty } from '@nestjs/swagger';
import { FileInfoVm } from './file-info-vm.model';

export class FileResponseVm {

    message: string;
    file: FileInfoVm;
}