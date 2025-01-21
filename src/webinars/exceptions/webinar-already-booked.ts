export class WebinarAlreadyBookedException extends Error {
    constructor() {
      super('User already registered for this webinar');
      this.name = 'WebinarAlreadyBookedException';
    }
  }
  