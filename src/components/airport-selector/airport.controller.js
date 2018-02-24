import AirportService from './airport.service';

export default class AirportController {
  constructor() {
    'ngInject';

    this.search = {
      departure: '',
      destination: ''
    };

    // I think most interessant it keep without DI
    this.airportService = new AirportService(this.search);
  }

  inputChange(prop, value) {
    const search = angular.copy(this.search);
    if (prop === AirportService.DEPARTURE) {
      search.departure = value;
    } else {
      search.destination = value;
    }
    this.search = search;
  }

  callDataList() {
    return this.findAiports();
  }

}
