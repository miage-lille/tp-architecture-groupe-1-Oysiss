import { InMemoryParticipationRepository } from "../adapters/participation-repository.in-memory";
import { InMemoryWebinarRepository } from "../adapters/webinar-repository.in-memory";
import { Participation } from "../entities/participation.entity";
import { BookSeat } from "./book-seat";

describe('Feature: Book seat', () => {
    let webinarRepository: InMemoryWebinarRepository;
    let participationRepository: InMemoryParticipationRepository;
    let useCase: BookSeat;

    const payload = {
        webinarId: 'webinar-id',
        userId: 'user-id',
    };

    function expectParticipationToEqual(participation: Participation) {
        expect(participation).toEqual({
            props: {
                webinarId: 'webinar-id',
                userId: 'user-id',
            },
            initialState: {
                webinarId: 'webinar-id',
                userId: 'user-id',
            },
        });
    }

    beforeEach(() => {
        webinarRepository = new InMemoryWebinarRepository();
        participationRepository = new InMemoryParticipationRepository();
        useCase = new BookSeat(participationRepository, webinarRepository);
    }

}