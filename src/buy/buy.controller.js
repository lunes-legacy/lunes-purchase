import LunesLib from 'lunes-lib';
import smartlookClient from 'smartlook-client';
import { STORAGE_KEY, COINS_CONSTANT, INTROJS_VIEWED_KEY } from '../constants/index';

const initialValue = '0.00000000';

class BuyController {
  constructor($rootScope, $scope, HttpService, $translate, $timeout, $state) {

    $rootScope.$on('unauthorized', () => {
      $state.go('login');
    });
    if (!localStorage.getItem(STORAGE_KEY)) {
      $state.go('login');
    }
    this.$scope = $scope;
    this.HttpService = HttpService;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.$state = $state;
    this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
    this.showContainerCoins = false;
    this.preICOFinished = false; // enable true here to show message "Pre-ICO finished"
    this.balanceCoins = {};
    this.currentPhase = [];
    this.currentPhaseActive = {};
    this.buyHistoryUser = {};
    this.valueToDeposit = '';
    this.valueToReceive = '';
    this.bonusAmountFinal = initialValue;
    this.buyLimit = '0';
    this.coins = JSON.parse(JSON.stringify(COINS_CONSTANT));
    this.currentCoinSelected = JSON.parse(JSON.stringify(this.coins[0]));
    this.currentQRCode = { address: '', img: '' };
    this.showUserMenu = false;
    this.showQrCode = false;
    this.msgCoinPlaceholder = $translate.instant('MSG_COIN_PLACEHOLDER', { COIN: this.currentCoinSelected.name });
    this.msgCoinPlaceholderLNS = $translate.instant('MSG_COIN_PLACEHOLDER_LNS');

    this.checkSeed();

    this.screens = {
      loading: false,
      logout: false,
      step1: true, // GENERATE SEED
      step2: false, //SHOW SEED AND ADDRESS
      step3: false, //CONFIRM    
      step4: false // TRANSACTIONS INFO
    }

    this.userAddressInfo = {}; //SEED AND ADDRESS
    this.transaction = {}
    this.withdraw = false;

    this.checkWithdraw();

    this.getBalanceCoin('BTC').catch(error => {
      console.log(error);
    });
    this.getBalanceCoin('LTC').catch(error => {
      console.log(error);
    });
    this.getBalanceCoin('ETH').catch(error => {
      console.log(error);
    });
    this.showDepositWalletAddressQRCode(this.currentUser, this.currentCoinSelected);
    this.obtainPhase().catch(error => {
      console.log(error);
    });
    this.getBuyHistory().catch(error => {
      console.log(error);
    });
    this.showLoading(true);


    if (this.currentUser) {
      const userTrack = { name: this.currentUser.fullname, email: this.currentUser.email, ownCoupon: this.currentUser.ownCoupon, coupon: this.currentUser.coupon, confirmIcoTerm: this.currentUser.confirmIcoTerm };
      if (this.currentUser.depositWallet && this.currentUser.depositWallet.BTC) {
        userTrack.btcAddress = this.currentUser.depositWallet.BTC.address;
        userTrack.ltcAddress = this.currentUser.depositWallet.LTC.address;
        // userTrack.ethAddress = this.currentUser.depositWallet.ETH.address;
      }
      if (this.currentUser && this.currentUser._id) {
        smartlookClient.identify(this.currentUser._id, userTrack);
      } else {
        smartlookClient.identify(this.currentUser.email, userTrack);
      }

      window.Intercom('boot', {
        app_id: 'a4bez1qo',
        name: this.currentUser.fullname, // Full name
        email: this.currentUser.email, // Email address
        created_at: new Date().toISOString(), // Signup date
      });

    }
  }

  // VERIFY WITHDRAW
  async checkWithdraw() {
    try {
      let balance = await this.getLnsBalance();
      let withdrawInfo = await this.HttpService.getWithdraw(this.currentUser.accessToken);

      if (withdrawInfo.data.txID) {
        this.transaction = withdrawInfo.data;
        this.withdraw = true;

        return true;
      }
      this.withdraw = false;

      return false;

    } catch (error) {
      console.log(error);
      this.withdraw = false;
      return false;
    }
  }

  async setWithdraw() {
    try {
      this.showLoading(true);

      let updateAddress = await this.HttpService.updateAddress(this.userAddressInfo.address, this.currentUser.accessToken);

      if (updateAddress && updateAddress.status === 'SUCCESS') {
        let sendBalance = await this.HttpService.sendBalance(this.currentUser.accessToken);

        if (sendBalance && sendBalance.status === 'SUCCESS') {
          if (sendBalance.data.txID) {
            this.showLoading(false);
            this.transaction = withdrawInfo.data;
            this.withdraw = true;
            localStorage.removeItem('SEED');
            this.changeStep('step4')

            return true;
          } else {
            this.showLoading(false);
            this.changeStep('step1')

            return false;
          }
        } else {
          this.showLoading(false);
          this.changeStep('step1')
          return false;
        }
      } else {
        this.showLoading(false);
        this.changeStep('step1')
      }
    } catch (error) {
      console.log(error)
      this.showLoading(false);
      this.changeStep('step1')

      return false;
    }
  }

  async checkSeed() {
    try {
      let seed = await localStorage.getItem('SEED');
      let withdraw = await this.checkWithdraw();
      console.log(seed)
      console.log(withdraw)

      if (seed && !withdraw) {
        await this.changeStep('step2')
        this.mountSeed();
      } else if (!seed && withdraw) {
        await this.changeStep('step4')
      } else {
        await this.changeStep('step1')
      }

    } catch (error) {
      console.log(error);
      await this.changeStep('step1')
    }
  }

  // GENERATE SEED AND ADDRESS
  mountSeed() {
    let data = this.getSeed();
    let dataAddress = this.HttpService.getAddress(data);
    let seed = data.split(" ");

    this.userAddressInfo = {
      seed: {
        group1: seed[0] + " " + seed[1] + " " + seed[2],
        group2: seed[3] + " " + seed[4] + " " + seed[5],
        group3: seed[6] + " " + seed[7] + " " + seed[8],
        group4: seed[9] + " " + seed[10] + " " + seed[11]
      },
      address: dataAddress
    }
    this.changeStep('step2')
  }

  getSeed() {
    try {
      let seed = localStorage.getItem('SEED');

      if (seed) {
        return JSON.parse(seed);
      } else {
        let data = this.HttpService.getSeedWord();

        localStorage.setItem('SEED', JSON.stringify(data));

        return data;
      }

    } catch (error) {
      console.log(error);
      let data = this.HttpService.getSeedWord();
      localStorage.setItem('SEED', JSON.stringify(data));

      return data;
    }
  }

  // CHANGE STEP
  async changeStep(toStep) {
    if (!this.withdraw) {
      for (let step in this.screens) {
        this.screens[step] = false;
      }
      this.screens[toStep] = true;
    } else {
      this.screens.logout = false;
      this.screens.step1 = false;
      this.screens.step2 = false;
      this.screens.step3 = false;
      this.screens.step4 = true;
    }
  }

  // END -----------------

  async getLnsBalance() {
    if (!this.currentUser) {
      this.totalLns = 0;
      return 0;
    }
    const history = await LunesLib.ico.buyHistory(this.currentUser.email, this.currentUser.accessToken, 1)
      .catch(err => console.log(err));

    const totalLns = history.reduce((total, item) => {
      return total + parseFloat(item.credit_value) + parseFloat(item.bonus_value);
    }, 0);

    this.totalLns = totalLns.toFixed(8);
    // this.totalLns = 0.00000000;

    return this.totalLns;
  }

  async getBuyHistory() {
    const buyHistory = await this.HttpService.buyHistory(this.currentUser.email, this.currentUser.accessToken);
    this.buyHistoryUser = buyHistory;
  }

  async showDepositWalletAddressQRCode(currentUser, coin) {
    const a = await this.HttpService.showDepositWalletAddressQRCode(this.currentUser, this.currentCoinSelected);
    this.currentQRCode = JSON.parse(JSON.stringify(a));
    if (coin) {
      this.getCurrentBalanceUser(coin.name, this.currentQRCode.address, this.currentUser);
    }
  }

  getPhaseActive() {
    const phase = this.currentPhase.filter(f => {
      return f.sale_status === 'active';
    });
    if (phase && phase.length) {
      return phase[0];
    }
    return {};
  }

  async obtainPhase() {
    try {
      let phase;
      if (localStorage.getItem('lunes.phase')) {
        this.currentPhase = JSON.parse(localStorage.getItem('lunes.phase'));
        phase = this.getPhaseActive();
        this.currentPhaseActive = JSON.parse(JSON.stringify(phase));
        this.currentPhaseActive.price_value = Number(this.currentPhaseActive.price_value).toFixed(2);

        this.percentBonus = phase.bonus * 100;

        this.priceValueLunes = parseFloat(phase.price_value);

        if (this.currentUser.whitelist && phase.name === 'Whitelist') {
          this.buyLimit = 1000000;
        } else {
          this.buyLimit = phase.maximum_individual_limit;
        }

        if (this.currentUser.couponOffer) {
          if (this.currentUser.couponOffer.maximum_individual_limit) {
            this.buyLimit = this.currentUser.couponOffer.maximum_individual_limit;
          }
          if (this.currentUser.couponOffer.bonus) {
            this.percentBonus = this.currentUser.couponOffer.bonus * 100;
          }
        }

        this.showLoading(false);
        return;
      }
      this.currentPhase = await this.HttpService.obtainPhase().catch(error => {
        //alert('Erro ao tentar recuperar dados da fase da ICO');
        console.log("Erro on get phase");
      });

      phase = this.getPhaseActive();

      this.percentBonus = phase.bonus * 100;

      this.priceValueLunes = parseFloat(phase.price_value);

      if (this.currentUser.whitelist && phase.name === 'Whitelist') {
        this.buyLimit = 1000000;
      } else {
        this.buyLimit = phase.maximum_individual_limit;
      }

      if (this.currentUser.couponOffer) {
        if (this.currentUser.couponOffer.maximum_individual_limit) {
          this.buyLimit = this.currentUser.couponOffer.maximum_individual_limit;
        }
        if (this.currentUser.couponOffer.bonus) {
          this.percentBonus = this.currentUser.couponOffer.bonus * 100;
        }
      }

      if (this.currentPhase) {
        localStorage.setItem('lunes.phase', JSON.stringify(this.currentPhase));
      }
      this.showLoading(false);
    } catch (e) {
      console.log(e);
    }


  }

  async getBalanceCoin(coin) {
    const balance = await this.HttpService.getBitcoinBalance(coin);
    this.balanceCoins[coin] = { balance };
  }

  async getBalanceCoinETH(coin) {
    const balance = await this.HttpService.getBalanceCoinETH(coin);
    this.balanceCoins[coin] = { balance };
  }

  async getBalanceLunes(coin, currentUser) {
    const balance = await this.HttpService.getBalanceLunes(coin, currentUser);
    this.balanceCoins[coin] = { balance };
  }

  goToHome() {
    this.$state.go('buy');
  }

  showHelp() {
    introJs().start();
  }

  showLoading(isShow) {
    if (isShow) {
      $(`<div class="modal-backdrop"><img src="https://res.cloudinary.com/luneswallet/image/upload/v1519442469/loading_y9ob8i.svg" /></div>`).appendTo(document.body);
    } else {
      this.$timeout(function () {
        $(".modal-backdrop").remove();
        if (!localStorage.getItem(INTROJS_VIEWED_KEY)) {
          localStorage.setItem(INTROJS_VIEWED_KEY, true);
          introJs().start();
        }
      }, 1000);
    }
  }

  /**
   * coinDestination, bonusRate, coinAmount, exchangeRate, unitPrice, coupon
   * coinDestination  - eh o simbolo da moeda,
   * bonusRate        - eh a taxa de bonus da fase atual da ico,
   * coinAmount       - eh a quantidade de criptomoeda,
   * exchangeRate     - o preco em dolar,
   * unitPrice        - o preco atual da lunes em dolar e
   * coupon           - eh o cupom de bonus do usuario se houver
   * 
   * Example: 30000 LNS => 0.27285849
   * Example: 1000  LNS => 0.00090953
   * Example: 500   LNS => 0.00045476
   * Example: 10    LNS => 0.00000910
  */
  calcValue(LNS) {
    if (!this.valueToReceive) {
      this.valueToReceive = '00000000';
    }

    if (!this.valueToDeposit) {
      this.valueToDeposit = initialValue;
    }

    if (this.valueToReceive.length > 8) {
      this.valueToReceive = this.valueToReceive.substr(0, 8);
    }

    if (this.valueToReceive.replace) {
      this.valueToReceive = this.valueToReceive.replace(/[^0-9.]+/, '');
    }

    const valueToReceive = parseFloat(this.valueToReceive);
    const valueToDeposit = parseFloat(this.valueToDeposit);

    // hide message error to value LNS less than 0
    this.errorTypeValueToReceive = false;

    if (isNaN(valueToReceive) || isNaN(valueToDeposit)) {
      this.valueToDeposit = initialValue;
      this.valueToReceive = '00000000';
    }

    if (LNS) {
      if (this.valueToReceive.indexOf && this.valueToReceive.indexOf(',') !== -1) {
        this.valueToReceive = this.valueToReceive.replace(/[, ]+/g, "0").trim();
      }
    } else if (this.valueToDeposit.indexOf && this.valueToDeposit.indexOf(',') !== -1) {
      this.valueToDeposit = this.valueToDeposit.replace(/[,]+/g, '').trim();
    }

    this.checkMaxLength();
    const phase = this.getPhaseActive();

    let bonusRate;
    if (this.currentUser.couponOffer) {

      if (this.currentUser.couponOffer.bonus) {
        bonusRate = this.currentUser.couponOffer.bonus;

      } else {
        bonusRate = phase.bonus;

      }
    } else {
      bonusRate = phase.bonus;
    }

    const currentPrice = this.balanceCoins[this.currentCoinSelected.name].balance.PRICE;
    const coupon = this.currentUser.coupon;

    this.buyLimit = parseFloat(this.buyLimit);
    bonusRate = parseFloat(bonusRate);

    let coinAmount = (LNS) ? valueToReceive : valueToDeposit;
    coinAmount = parseFloat(coinAmount);
    if (isNaN(coinAmount)) {
      coinAmount = 0;
    }
    const unitPrice = phase.price_value;
    let calculateFinal = 0;

    if (LNS) {
      if (coinAmount > this.buyLimit) {
        coinAmount = this.buyLimit;
        this.valueToReceive = this.buyLimit;
      }

      calculateFinal = LunesLib.ico.buyConversion.fromLNS(bonusRate, coinAmount, currentPrice, unitPrice, coupon);
      this.valueToDeposit = calculateFinal.buyAmount;
      this.bonusAmountFinal = (parseFloat(bonusRate) * this.valueToReceive).toString();

      this.$timeout(() => {
        this.valueToReceive = parseFloat(this.valueToReceive);
        //this.valueToDeposit = parseFloat(this.valueToDeposit);
      }, 2000);

      return;
    }

    calculateFinal = LunesLib.ico.buyConversion.toLNS(bonusRate, coinAmount, currentPrice, unitPrice, coupon);

    this.$timeout(() => {
      if (this.valueToReceive !== '0.00000000') {
        this.valueToReceive = parseFloat(this.valueToReceive);
      }
      //this.valueToDeposit = parseFloat(this.valueToDeposit);
    }, 2000);

    this.valueToReceive = calculateFinal.buyAmount.toString();
    this.bonusAmountFinal = calculateFinal.bonusAmount;



    if (this.valueToReceive > this.buyLimit) {
      coinAmount = this.buyLimit;
      this.valueToReceive = this.buyLimit;
      this.bonusAmountFinal = (parseFloat(bonusRate) * this.buyLimit).toString();
      this.calcValue('LNS');
    }
  }

  getBuyLimit() {
    return parseFloat(this.buyLimit);
  }

  /**
   * Quantidade de Lunes (qtd) = resultado da calculadora
   * 30% Bônus (bonus) = 30% de qtd
   * Total = qtd + bonus
  */
  getTotal() {
    const amountLNS = parseFloat(this.valueToReceive);
    const bonus = parseFloat(this.getPhaseActive().bonus) * amountLNS;
    const total = amountLNS + bonus;
    return isNaN(total) ? 0 : total.toFixed(8);
  }

  getTotalLNSParcial() {
    return (this.valueToReceive.toFixed) ? this.valueToReceive.toFixed(8) : this.valueToReceive;
  }

  checkMaxLength() {
    if (typeof this.valueToDeposit === 'number') {
      this.valueToDeposit = this.valueToDeposit.toString();
    }
    const numberMax = 10;
    if (!isNaN(this.valueToDeposit) && this.valueToDeposit.indexOf(',') !== -1) {
      this.valueToDeposit = this.valueToDeposit.replace(",", ".");
    }
    if (this.valueToDeposit.length > numberMax) {
      this.valueToDeposit = this.valueToDeposit.substring(0, numberMax);
    }
  }

  showQuotation() {
    if (Object.keys(this.balanceCoins).length) {
      return this.balanceCoins[this.currentCoinSelected.name].balance.PRICE;
    } else {
      return this.$translate.instant('LOADING');
    }
  }

  getFlag() {
    const flagUS = 'https://res.cloudinary.com/luneswallet/image/upload/v1519442468/flag-us_jxifyu.png';
    const flagBR = 'https://res.cloudinary.com/luneswallet/image/upload/v1519442467/flag-br_ksncrn.png';
    return this.$translate.instant('CURRENCY_USER') === 'USD' ? flagUS : flagBR;
  }

  logout() {
    localStorage.removeItem('SEED');
    localStorage.removeItem(STORAGE_KEY);
  }

  async getCurrentBalanceUser(coin, address, currentUser) {
    const balance = await this.HttpService.getBalance(coin, address, currentUser);
    this.$timeout(() => {
      if (balance && balance.network === 'ETH') {
        this.balanceUser = {
          confirmed_balance: balance.balance
        };
      } else {
        this.balanceUser = balance;
      }
    }, 200);
  }

  selectCoin(coinSelected) {
    let self = this;

    this.showQrCode = false;
    this.valueToDeposit = '';
    this.valueToReceive = '';

    this.coins = this.coins.filter(coin => {
      coin.selected = false;
      if (coin.label === coinSelected.label) {
        self.currentCoinSelected = JSON.parse(JSON.stringify(coin));
        self.showDepositWalletAddressQRCode(self.currentUser, coin);
        coin.selected = true;
      }
      return coin;
    });

    this.msgCoinPlaceholder = this.$translate.instant('MSG_COIN_PLACEHOLDER', { COIN: this.currentCoinSelected.name });

    this.$timeout(() => {
      this.$scope.$apply();
    }, 200);
    //this.openCoinSelect();
  }

  openCoinSelect() {
    this.showContainerCoins = !this.showContainerCoins;
  }

  toogleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toogleShowQrCode() {
    if (!this.valueToDeposit) {
      this.errorTypeValueToReceive = this.$translate.instant('AMOUNT_MINIMUN_VALIDATION');
      return;
    }
    this.HttpService.toBuy(this.currentQRCode.address).catch(error => {
      console.log(error);
    });
    this.showQrCode = !this.showQrCode;
  }

  toogleShowSeedAndAddress() {
    alert('Este botão funciona!')
  }
}

BuyController.$inject = ['$rootScope', '$scope', 'HttpService', '$translate', '$timeout', '$state'];

export default BuyController;
