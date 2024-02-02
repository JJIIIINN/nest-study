import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValidationPipe implements PipeTransform {
    readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];
    transform(value: any) {
        if (!this.isStatusValid(value)) {
            throw new BadRequestException();
        }
        return value;
    }

    private isStatusValid(status: BoardStatus) {
        const index = this.StatusOptions.indexOf(status);
        return index !== -1;
    }
}
