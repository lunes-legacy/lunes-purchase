import LunesLib from 'lunes-lib';
import { STORAGE_KEY } from '../constants/index';

class DashboardController {
  constructor($scope, HttpService, $translate, $state) {
    this.$scope = $scope;
    this.HttpService = HttpService;
    this.$translate = $translate;
    this.$state = $state;
    this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
    this.history = [];
    this.balanceCoins = {};

    this.getHistory();

    this.getBalanceLunes('LNS', this.currentUser)
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  async getHistory() {
    LunesLib.ico.buyHistory(this.currentUser.email, this.currentUser.accessToken)
      .then((history) => {
        this.history = history;
        console.log('Histórico');
        console.log(history);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getBalanceLunes(coin, currentUser) {
    const balance = await this.HttpService.getBalanceLunes(coin, currentUser);
    console.log(balance);
  }
}

DashboardController.$inject = ['$scope', 'HttpService', '$translate', '$state'];

export default DashboardController;
