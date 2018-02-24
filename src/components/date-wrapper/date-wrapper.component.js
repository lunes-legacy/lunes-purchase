import template from './date-wrapper.component.html';
import controller from './date-wrapper.controller';

const DateWrapperComponent = {
  bindings: {
    startDate: '=',
    endDate: '='
  },
  template,
  controller
};

export default DateWrapperComponent;
