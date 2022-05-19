import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    // QUERY BUILDER
    const games = await this.repository
      .createQueryBuilder("games")
      .where("LOWER(games.title) ILIKE LOWER(:title)", { title: `%${param}%` })
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    // RAW QUERY
    const gameCount = await this.repository.query("SELECT COUNT(*) FROM games");

    return gameCount;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // QUERY BUILDER
    const users = await this.repository
      .createQueryBuilder("games")
      .relation(Game, "users")
      .of(id)
      .loadMany();

    return users;
  }
}
