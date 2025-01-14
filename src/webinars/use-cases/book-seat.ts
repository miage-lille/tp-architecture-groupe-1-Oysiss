import { IMailer } from 'src/core/ports/mailer.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import { Participation } from '../entities/participation.entity';
import { IDateGenerator } from 'src/core/ports/date-generator.interface';
import { Webinar } from '../entities/webinar.entity';
import { WebinarDatesTooSoonException } from '../exceptions/webinar-dates-too-soon';
import { WebinarNotEnoughSeatsException } from '../exceptions/webinar-not-enough-seats';
import { WebinarNotFoundException } from '../exceptions/webinar-not-found';
import { WebinarNoMoreAvailableSeatsException } from '../exceptions/webinar-no-more-seats';
import { WebinarAlreadyBookedException } from '../exceptions/webinar-already-booked';

type Request = {
  webinarId: string;
  user: User;
};
type Response = void;

export class BookSeat implements Executable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly webinarRepository: IWebinarRepository,
  ) {}
  async execute({ webinarId, user }: Request): Promise<Response> {
    const webinar = await this.webinarRepository.findById(webinarId);
    
    if (!webinar) {
      throw new WebinarNotFoundException();
    }

    const participations: Participation[] = await this.participationRepository.findByWebinarId(webinarId);
    if (participations.length >= webinar.props.seats) {
      throw new WebinarNoMoreAvailableSeatsException();
    }

    if (participations.some(participation => participation.props.userId === user.props.id)) {
      throw new WebinarAlreadyBookedException();
    }

    const participation = new Participation({
      webinarId: webinarId,
      userId: user.props.id,
    });

    return this.participationRepository.save(participation);
  }
}
