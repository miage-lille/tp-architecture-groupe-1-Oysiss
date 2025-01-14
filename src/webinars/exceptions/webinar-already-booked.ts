export class WebinarAlreadyBookedException extends Error {
    constructor() {
      super('Webinar already booked by user');
      this.name = 'WebinarAlreadyBookedException';
    }
  }
  