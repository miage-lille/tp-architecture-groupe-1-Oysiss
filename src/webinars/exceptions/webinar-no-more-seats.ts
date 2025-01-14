export class WebinarNoMoreAvailableSeatsException extends Error {
    constructor() {
      super('Webinar does not have any more seats');
      this.name = 'WebinarNoMoreSeatsException';
    }
  }
  