import AirportService from './airport.service';

describe('AirportComponent', () => {
  let $compile; // eslint-disable-line
  let scope; // eslint-disable-line
  let crtl; // eslint-disable-line
  let $componentController; // eslint-disable-line
  let airportService;
  beforeEach(() => angular.mock.module('app.components'));

  beforeEach(inject(($rootScope, _$compile_, _$componentController_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;
    $componentController = _$componentController_;
  }));

  beforeEach(() => {
    const search = {
      departure: 'Fortaleza',
      destination: 'Rio'
    };
    crtl = $componentController('airportSelect', { $scope: scope }, { search });
  });

  it('departure should have value', () => {
    expect(crtl.search).toBeDefined();
    expect(crtl.search.departure).toBe('Fortaleza');
  });

  it('destination should have value', () => {
    expect(crtl.search.destination).toBe('Rio');
  });

  it('#inputChange() should be exist', () => {
    expect(crtl.inputChange).toBeDefined();
  });

  it('#inputChange() should test input data', () => {
    const search = {
      departure: 'Irlanda',
      destination: ''
    };

    airportService = new AirportService(search);
    expect(airportService.isDeparture()).toBe(true);

    crtl.inputChange('departure', search.departure);
    expect(crtl.search.departure).toBe('Irlanda');
  });
});
