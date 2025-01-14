import { Participation } from 'src/webinars/entities/participation.entity';

export interface IParticipationRepository {
  findByWebinarIdAndUserId(webinarId: string, userId: string): Promise<Participation | undefined>;
  findByWebinarId(webinarId: string): Promise<Participation[]>;
  save(participation: Participation): Promise<void>;
}
