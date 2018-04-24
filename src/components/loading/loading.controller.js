export default class LoadingController {
  constructor($scope) {
    'ngInject';
    this.showLoading($scope);
  }

  showLoading($scope) {
    $scope.$watch('$ctrl.show', (isShow) => {
      console.log("");
      if (isShow) {
        $('<div class="modal-backdrop"></div>').appendTo(document.body);
      } else {
        $(".modal-backdrop").remove();
      }
    });
  }

}

