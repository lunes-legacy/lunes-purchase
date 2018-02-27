import { STORAGE_KEY } from '../constants/index';
import LunesLib from 'lunes-lib';

const initialValue = '0.00000000';

class BuyController {
  constructor($scope, HttpService, $translate, $timeout, $state) {
    this.$scope = $scope;
    this.HttpService = HttpService;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.$state = $state;
    this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
    this.showContainerCoins = false;
    this.balanceCoins = {};
    this.currentPhase = [];
    this.buyHistoryUser = {};
    this.valueToDeposit = initialValue;
    this.valueToReceive = initialValue;
    this.bonusAmountFinal = initialValue;
    this.buyLimit = '0';
    this.coins = [{
      label: 'Bitcoin',
      name: 'BTC',
      img: 'https://res.cloudinary.com/luneswallet/image/upload/v1519442467/icon_btc.svg',
      selected: true
    }, {
      label: 'Litecoin',
      name: 'LTC',
      img: 'https://res.cloudinary.com/luneswallet/image/upload/v1519442468/icon_ltc.svg',
      selected: false
    }, {
      label: 'Ethereum',
      name: 'ETH',
      img: 'https://res.cloudinary.com/luneswallet/image/upload/v1519442467/icon_eth.svg',
      selected: false
    }];
    this.currentCoinSelected = JSON.parse(JSON.stringify(this.coins[0]));
    this.currentQRCode = { address: '', img: '' };
    this.getBalanceCoin('BTC').catch(error => {
      console.log(error);
    });
    this.getBalanceCoin('LTC').catch(error => {
      console.log(error);
    });
    this.getBalanceCoin('ETH').catch(error => {
      console.log(error);
    });
    /*this.getBalanceLunes('LNS', this.currentUser).catch(error => {
      console.log(error);
    });*/
    this.showDepositWalletAddressQRCode(this.currentUser, this.currentCoinSelected);
    this.obtainPhase().catch(error => {
      console.log(error);
    });
    this.getBuyHistory().catch(error => {
      console.log(error);
    });
    this.showLoading(true);
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

  async doBuy() {

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

        this.percentBonus = phase.bonus*100;
        this.priceValueLunes = parseFloat(phase.price_value);

        if (this.currentUser.whitelist && phase.name === 'Whitelist') {
          this.buyLimit = 1000000;
        } else {
          this.buyLimit = phase.maximum_individual_limit;
        }

        this.showLoading(false);
        return;
      }
      this.currentPhase = await this.HttpService.obtainPhase().catch(error => {
        alert('Erro ao tentar recuperar dados da fase da ICO');
      });

      phase = this.getPhaseActive();

      this.percentBonus = phase.bonus*100;
      this.priceValueLunes = parseFloat(phase.price_value);

      if (this.currentUser.whitelist && phase.name === 'Whitelist') {
        this.buyLimit = 1000000;
      } else {
        this.buyLimit = phase.maximum_individual_limit;
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

  showLoading(isShow) {
    if (isShow) {
      $(`<div class="modal-backdrop"><img src="https://res.cloudinary.com/luneswallet/image/upload/v1519442469/loading_y9ob8i.svg" /></div>`).appendTo(document.body);
    } else {
      this.$timeout(function() {
        $(".modal-backdrop").remove();
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
  */
  calcValue(LNS) {
    if(!this.valueToReceive){
      this.valueToReceive = initialValue
    }

    if(!this.valueToDeposit){
      this.valueToDeposit = initialValue
    }

    const valueToReceive = parseFloat(this.valueToReceive)
    const valueToDeposit = parseFloat(this.valueToDeposit)

    if(isNaN(valueToReceive) || isNaN(valueToDeposit)){
      this.valueToDeposit = initialValue
      this.valueToReceive = initialValue
    }

    if (LNS) {
      if (this.valueToReceive.indexOf(',') !== -1) {
        this.valueToReceive = this.valueToReceive.replace(/[, ]+/g, "0").trim();
      }
    } else {
      if (this.valueToDeposit.indexOf(',') !== -1) {
        this.valueToDeposit = this.valueToDeposit.replace(/[,]+/g, '').trim();
      }
    }
    this.checkMaxLength();
    const phase = this.getPhaseActive();
    const bonusRate = phase.bonus;
    const currentPrice = this.balanceCoins[this.currentCoinSelected.name].balance.PRICE;
    const coupon = this.currentUser.coupon;

    this.valueToReceive = parseFloat(this.valueToReceive)
    this.valueToDeposit = parseFloat(this.valueToDeposit)
    this.buyLimit = parseFloat(this.buyLimit)

    let coinAmount = (LNS) ? this.valueToReceive : this.valueToDeposit;
    coinAmount = parseFloat(coinAmount)
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
      this.bonusAmountFinal = (parseFloat(phase.bonus) * this.valueToReceive).toString();
      return;
    }

    calculateFinal = LunesLib.ico.buyConversion.toLNS(bonusRate, coinAmount, currentPrice, unitPrice, coupon);

    this.valueToReceive = calculateFinal.buyAmount.toString();
    this.bonusAmountFinal = calculateFinal.bonusAmount;

    if (this.valueToReceive > this.buyLimit) {
      this.showErrorLimit = 'Você ultrapassou o limite de compra!';
      coinAmount = this.buyLimit;
      this.valueToReceive = this.buyLimit;
	  this.bonusAmountFinal = (parseFloat(phase.bonus) * this.buyLimit).toString();
    }else{
      this.showErrorLimit = ''
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
    return total.toFixed(8);
  }

  checkMaxLength() {
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
    this.valueToDeposit = initialValue;
    this.valueToReceive = initialValue;
    let self = this;
    this.coins = this.coins.filter(coin => {
      coin.selected = false;
      if (coin.label === coinSelected.label) {
        self.currentCoinSelected = JSON.parse(JSON.stringify(coin));
        self.showDepositWalletAddressQRCode(self.currentUser, coin);
        coin.selected = true;
      }
      return coin;
    });
    this.$timeout(() => {
      this.$scope.$apply();
    }, 200);
    //this.openCoinSelect();
  }

  openCoinSelect() {
    this.showContainerCoins = !this.showContainerCoins;
  }
}

BuyController.$inject = ['$scope', 'HttpService', '$translate', '$timeout', '$state'];

export default BuyController;
