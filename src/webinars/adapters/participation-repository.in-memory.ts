import { Participation } from 'src/webinars/entities/participation.entity';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';

export class InMemoryParticipationRepository implements IParticipationRepository {
    constructor(public database: Participation[] = []) {}
    async findByWebinarIdAndUserId(webinarId: string, userId: string): Promise<Participation| undefined>  {
        return this.database.find(participation => participation.props.webinarId === webinarId && participation.props.userId === userId)   
    }
  
    async findByWebinarId(webinarId: string): Promise<Participation[]> {
        return this.database.filter(participation => participation.props.webinarId === webinarId);
    }

    async save(participation: Participation): Promise<void> {
        this.database.push(participation);
    }
}
