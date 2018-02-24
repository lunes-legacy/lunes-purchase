export default class InputAutocompleteController {
  constructor() {
    'ngInject';

    this.ngModel = '';
    this.list = [];
  }

  async $onInit() {
    this.list = await this.callDataList();
  }

  $onChanges(changes) {
    this.ngModel = changes.ngModel;
  }

  valueChange(prop, value) {
    this.inputChange({ prop, value });
  }
}
