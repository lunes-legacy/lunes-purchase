import template from './date-selector.component.html';
import controller from './date-selector.controller';

const DateSelectorComponent = {
  bindings: {
    date: '='
  },
  template,
  controller
};

export default DateSelectorComponent;
