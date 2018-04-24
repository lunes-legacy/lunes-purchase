import template from './airport.component.html';
import controller from './airport.controller';

const AirportComponent = {
  bindings: {
    search: '<',
    findAiports: '&'
  },
  template,
  controller,
};

export default AirportComponent;
