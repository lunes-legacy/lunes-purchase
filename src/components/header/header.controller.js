import { STORAGE_KEY } from '../../constants/index';

class HeaderController {
  constructor($state) {
    'ngInject';
    this.$state = $state;
    this.coin = {};
    this.price = '';
    this.showlinks = true;
    this.showlogout = true;
  }
  logout() {
    localStorage.removeItem(STORAGE_KEY);
  }

  goToHome() {
    this.$state.go('buy');
  }
}

HeaderController.$inject = ['$state'];

export default HeaderController;
