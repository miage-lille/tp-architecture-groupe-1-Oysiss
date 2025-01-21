import { InMemoryMailer } from 'src/core/adapters/in-memory-mailer';
import { InMemoryWebinarRepository } from 'src/webinars/adapters/webinar-repository.in-memory';
import { InMemoryParticipationRepository } from 'src/webinars/adapters/participation-repository.in-memory';
import { BookSeat } from 'src/webinars/use-cases/book-seat';
import { User } from 'src/users/entities/user.entity';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { Participation } from 'src/webinars/entities/participation.entity';

describe('Feature: Book a seat', () => {
  let participationRepository: InMemoryParticipationRepository;
  let webinarRepository: InMemoryWebinarRepository;
  let mailer: InMemoryMailer;
  let useCase: BookSeat;

  beforeEach(() => {
    participationRepository = new InMemoryParticipationRepository();
    webinarRepository = new InMemoryWebinarRepository();
    mailer = new InMemoryMailer();
    useCase = new BookSeat(participationRepository, webinarRepository, mailer);
  });

  it('should book a seat for a user', async () => {
    const user = new User({
      id: 'user-1',
      email: 'user@example.com',
      password: 'password',
    });
    const webinar = new Webinar({
      id: 'webinar-1',
      organizerId: 'organizer-1',
      title: 'Webinar',
      startDate: new Date(),
      endDate: new Date(),
      seats: 10,
    });
    await webinarRepository.create(webinar);

    await useCase.execute({ webinarId: 'webinar-1', user });

    const participations =
      await participationRepository.findByWebinarId('webinar-1');
    expect(participations).toHaveLength(1);
    expect(mailer.sentEmails).toHaveLength(1);
  });

  it('should not book a seat if user is already registered', async () => {
    const user = new User({
      id: 'user-1',
      email: 'user@example.com',
      password: 'password',
    });
    const webinar = new Webinar({
      id: 'webinar-1',
      organizerId: 'organizer-1',
      title: 'Webinar',
      startDate: new Date(),
      endDate: new Date(),
      seats: 10,
    });
    await webinarRepository.create(webinar);
    const participation = new Participation({
      userId: 'user-1',
      webinarId: 'webinar-1',
    });
    await participationRepository.save(participation);

    await expect(
      useCase.execute({ webinarId: 'webinar-1', user }),
    ).rejects.toThrow('User already registered for this webinar');
  });

  it('should not book a seat if no seats are available', async () => {
    const user = new User({
      id: 'user-1',
      email: 'user@example.com',
      password: 'password',
    });
    const webinar = new Webinar({
      id: 'webinar-1',
      organizerId: 'organizer-1',
      title: 'Webinar',
      startDate: new Date(),
      endDate: new Date(),
      seats: 1,
    });
    await webinarRepository.create(webinar);
    const participation = new Participation({
      userId: 'user-2',
      webinarId: 'webinar-1',
    });
    await participationRepository.save(participation);

    await expect(
      useCase.execute({ webinarId: 'webinar-1', user }),
    ).rejects.toThrow('Webinar must have at least 1 seat');
  });
});