class AirportService {
  static get DEPARTURE() {
    return 'departure';
  }

  static get DESTINATION() {
    return 'destination';
  }

  constructor(search) {
    this.search = search;
  }

  isDeparture() {
    return this.search.departure !== '';
  }

  searchByProps(prop, value) {
    const search = angular.copy(this.search);
    if (prop === AirportService.DEPARTURE) {
      search.departure = value;
    } else {
      search.destination = value;
    }
    this.search = search;
    return this.search;
  }
}

export default AirportService;
