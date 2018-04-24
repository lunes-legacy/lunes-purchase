import template from './input-autocomplete.component.html';
import controller from './input-autocomplete.controller';

const InputAutocompleteComponent = {
  require: {
    ngModel: '^ngModel'
  },
  bindings: {
    ngModel: '<',
    placeholder: '@',
    name: '@',
    inputChange: '&',
    callDataList: '&',
  },
  template,
  controller,
};

export default InputAutocompleteComponent;
