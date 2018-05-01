import LunesLib from 'lunes-lib';
import smartlookClient from 'smartlook-client';
import { STORAGE_KEY, COINS_CONSTANT } from '../constants/index';

class DashboardController {
  constructor($scope, HttpService, $translate, $timeout, $state) {
    this.$scope = $scope;
    this.HttpService = HttpService;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$state = $state;
    this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
    this.phases = [];
    this.phaseName = '';
    this.history = [];
    this.totalLns = 0;
    this.coins = COINS_CONSTANT;
    this.showUserMenu = false;
    this.getHistory();
    this.getProcessedBalanceUser();

    if (this.currentUser) {
      const userTrack = { name: this.currentUser.fullname, email: this.currentUser.email, ownCoupon: this.currentUser.ownCoupon, coupon: this.currentUser.coupon, confirmIcoTerm: this.currentUser.confirmIcoTerm };
      if (this.currentUser.depositWallet && this.currentUser.depositWallet.BTC) {
        userTrack.btcAddress = this.currentUser.depositWallet.BTC.address;
        userTrack.ltcAddress = this.currentUser.depositWallet.LTC.address;
        userTrack.ethAddress = this.currentUser.depositWallet.ETH.address;
      }
      if (this.currentUser._id) {
        smartlookClient.identify(this.currentUser._id, userTrack );
      } else {
        smartlookClient.identify(this.currentUser.email, userTrack );
      }

      window.Intercom('boot', {
        app_id: 'a4bez1qo',
        name: this.currentUser.fullname, // Full name
        email: this.currentUser.email, // Email address
        created_at: new Date().toISOString() // Signup date
      });

    }
      
  }

  async getProcessedBalanceUser() {
    const BTC = await this.HttpService.showDepositWalletAddressQRCode(this.currentUser, this.coins[0]);
    const LTC = await this.HttpService.showDepositWalletAddressQRCode(this.currentUser, this.coins[1]);
    const ETH = await this.HttpService.showDepositWalletAddressQRCode(this.currentUser, this.coins[2]);

    this.balanceBTC = await this.getCurrentBalanceUser(this.coins[0].name, BTC.address, this.currentUser);
    this.balanceLTC = await this.getCurrentBalanceUser(this.coins[1].name, LTC.address, this.currentUser);
    this.balanceETH = await this.getCurrentBalanceUser(this.coins[2].name, ETH.address, this.currentUser);

    if (this.balanceETH && this.balanceETH.network === 'ETH') {
      if (this.balanceETH.balance === '0') {
        this.balanceETH.balance = '0.00000000';
      }
      this.balanceETH.confirmed_balance = this.balanceETH.balance;
    }

    this.$timeout(() => {
      this.balanceProcessed = {
        BTC: JSON.parse(JSON.stringify(this.balanceBTC)),
        LTC: JSON.parse(JSON.stringify(this.balanceLTC)),
        ETH: JSON.parse(JSON.stringify(this.balanceETH))
      };
    }, 200);
  }

  async getCurrentBalanceUser(coin, address, currentUser) {
    const balance = await this.HttpService.getBalance(coin, address, currentUser);
    return balance;
  }

  showLoading(isShow) {
    if (isShow) {
      $(`<div class="modal-backdrop"><img src="https://res.cloudinary.com/luneswallet/image/upload/v1519442469/loading_y9ob8i.svg" /></div>`).appendTo(document.body);
    } else {
      this.$timeout(function() {
        $(".modal-backdrop").remove();
      }, 1000);
    }
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  }

  checkWidthScreenDesktop() {
    return window.innerWidth >= 768;
  }

  checkWidthScreenMobile() {
    return window.innerWidth < 768;
  }

  async getHistory() {
    this.showLoading(true);
    if (!this.currentUser) {
      this.$state.go('login');
    }
    const history = await LunesLib.ico.buyHistory(this.currentUser.email, this.currentUser.accessToken, 1).catch(err => {
      if (err && err.error && err.error.status === 401) {
        localStorage.removeItem(STORAGE_KEY);
        this.$state.go('login');
      }
    });
    this.getPhases();
    this.$timeout(() => {
      this.showLoading(false);
      if (history) {
        this.history = history.map((item) => {
          const total = parseFloat(item.credit_value) + parseFloat(item.bonus_value);
          this.getHistoryPhase(item.sale_phase_id);
  
          return {
            total: total.toFixed(8),
            created: item.created,
            phase: this.phaseName,
            deposit_value: parseFloat(item.deposit_value),
            deposit_coin: item.deposit_coin,
            credit_value: parseFloat(item.credit_value),
            bonus_value: parseFloat(item.bonus_value)
          };
        });
  
        this.getTotalLns();
      }
    }, 100);
  }

  async getTotalLns() {
    const totalLns = this.history.reduce((total, item) => {
      return total + parseFloat(item.credit_value) + parseFloat(item.bonus_value);
    }, 0);

    this.totalLns = totalLns.toFixed(8);
  }

  async getPhases() {
    if (localStorage.getItem('lunes.phase')) {
      this.phases = JSON.parse(localStorage.getItem('lunes.phase'));
      return;
    }

    this.phases = await this.HttpService.obtainPhase()
      .catch((error) => {
        console.log('Erro ao tentar recuperar dados da fase');
      });
  }

  async getHistoryPhase(phase) {
    const historyPhase = this.phases.filter(item => item.sale_id === phase);

    if (historyPhase.length === 0) {
      this.phaseName = '-';
      return;
    }

    this.phaseName = historyPhase[0].name;
  }

  toogleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }
}

DashboardController.$inject = ['$scope', 'HttpService', '$translate', '$timeout', '$state'];

export default DashboardController;
