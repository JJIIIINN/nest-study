import { DataSource, Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
    constructor(dataSource: DataSource) {
        super(Board, dataSource.createEntityManager());
    }

    async createBoard({ title, description }: CreateBoardDto, user: User): Promise<Board> {
        const board = this.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user,
        });

        await this.save(board);

        return board;
    }

    async getAllBoards(user: User): Promise<Board[]> {
        const query = this.createQueryBuilder('board').where('board.userId = :userId', { userId: user.id });

        const boards = await query.getMany();

        return boards;
    }

    async getBoardById(id: number): Promise<Board> {
        const found = await this.findOne({ where: { id } });

        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.delete({ id, user });

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.save(board);

        return board;
    }
}
