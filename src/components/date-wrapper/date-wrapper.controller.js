import moment from 'moment';

export default function DateWrapperController($scope) {
  'ngInject';

  $scope.$watch('$ctrl.startDate', () => {
    if (moment(this.startDate) > moment(this.endDate)) {
      this.endDate = moment(this.startDate).add(2, 'd').toDate();
    }
  });

  $scope.$watch('$ctrl.endDate', () => {
    if (moment(this.endDate) < moment(this.startDate)) {
      this.startDate = moment(this.endDate).subtract(2, 'd').toDate();
    }
  });
}
