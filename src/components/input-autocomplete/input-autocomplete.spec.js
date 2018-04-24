describe('InputAutocompleteComponent', () => {
  let $compile; // eslint-disable-line
  let scope; // eslint-disable-line
  let crtl; // eslint-disable-line
  let $componentController; // eslint-disable-line

  beforeEach(() => angular.mock.module('app.components'));

  beforeEach(inject(($rootScope, _$compile_, _$componentController_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;
    $componentController = _$componentController_;
  }));

  beforeEach(() => {
    crtl = $componentController('inputAutocomplete', { $scope: scope }, null);  // eslint-disable-line
  });

  it('#valueChange() shold be existe', () => {
    expect(crtl.valueChange).toBeDefined();
  });
});
