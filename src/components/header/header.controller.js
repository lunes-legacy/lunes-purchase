import LunesLib from 'lunes-lib';
import { STORAGE_KEY } from '../../constants/index';

class HeaderController {
  constructor($state, $timeout) {
    'ngInject';
    this.$state = $state;
    this.$timeout = $timeout;
    this.coin = {};
    this.price = '';
    this.showlinks = true;
    this.showlogout = true;
    this.history = [];
    this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
    this.getHistory().catch(err => {
      console.log(err);
    })
  }

  async getHistory() {
    if (!this.currentUser) {
      return;
    }
    const history = await LunesLib.ico.buyHistory(this.currentUser.email, this.currentUser.accessToken, 1).catch(err => console.log(err));
    this.$timeout(() => {
      this.history = history.map((item) => {
        const total = parseFloat(item.credit_value) + parseFloat(item.bonus_value);
        
        return {
          total: total,
          deposit_value: parseFloat(item.deposit_value),
          deposit_coin: item.deposit_coin,
          credit_value: parseFloat(item.credit_value),
          bonus_value: parseFloat(item.bonus_value)
        };
      });

      this.getTotalLns();
    }, 100);
  }

  async getTotalLns() {
    const totalLns = this.history.reduce((total, item) => {
      return total + parseFloat(item.credit_value) + parseFloat(item.bonus_value);
    }, 0);

    this.totalLns = totalLns;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  }

  goToHome() {
    this.$state.go('buy');
  }
}

HeaderController.$inject = ['$state', '$timeout'];

export default HeaderController;
