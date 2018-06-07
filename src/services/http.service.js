import LunesLib from 'lunes-lib';
import axios from 'axios';
import { PERIOD } from '../constants';
import CCC from '../utils/ccc-streamer-utilities';
import Interceptor from '../utils/interceptor';

class HttpService {
  constructor($http, $translate) {
    'ngInject';
    this.http = $http;
    this.$translate = $translate;
  }

  async saveTwofa(twofa, timestamp, email) {
    const a = await LunesLib.users.saveTwofa({ twofa, timestamp, email });
    return a;
  }

  async verifyTwofa(twofa, email) {
    if (typeof twofa !== 'string') {
      return;
    }
    if (twofa.length > 6) {
      twofa = twofa.substr(0, 6);
    }
    const a = await LunesLib.users.verifyTwofa({ twofa, email });
    return a;
  }

  async login(userData) {
    if (userData.email) {
      userData.email = userData.email.toLowerCase();
    }
    const data = await LunesLib.users.login(userData);
    return data;
  }

  async signup(userData) {
    if (userData.email) {
      userData.email = userData.email.toLowerCase();
    }
    const obj = {
      email: userData.email,
      password: userData.password,
      fullname: `${userData.name} ${userData.lastname}`,
      coupon: userData.coupon,
      testnet: userData.testnet || false
    };
    const data = await LunesLib.users.create(obj);
    return data;
  }

  async toBuy(address) {
    if (!address) { return; }
    const buyed = await axios.get(`https://apiw.lunes.io/api/ico/request-buy/${address}`).catch(error => {
      throw new Error(error);
    });
    return buyed;
  }

  async changePassword(email, accessToken) {
    const a = await LunesLib.users.resetPassword({ email });
    return a;
  }

  async generateTwofa(email, generateNewQRCode) {
    const bae64Img = await LunesLib.users.generateTwofa(email, generateNewQRCode);
    return bae64Img;
  }

  async confirmterm(currentUser) {
    try {
      /* TODO - remove true value to production */
      let confirmTerm = await LunesLib.ico.confirmTerm(currentUser.email, currentUser.accessToken);
      return confirmTerm;
    } catch (error) {
      throw new Error(error);
    }
  }

  async obtainPhase() {
    const phase = await LunesLib.ico.obtainPhase();
    return phase;
  }

  /**
   * @param {object} currentUser - { user info }
   * @param {object} currentCoiSelected - { name: 'BTC' }
  */
  async showDepositWalletAddressQRCode(currentUser, currentCoinSelected) {
    try {
      const address = JSON.parse(JSON.stringify(currentUser.depositWallet[currentCoinSelected.name].address));
      return {
        address,
        img: `https://chart.googleapis.com/chart?cht=qr&chl=${address}&chs=200x200&chld=L|0")`
      };
    } catch (e) {
      return {
        address: 'error',
        img: `https://www.computerhope.com/jargon/e/error.gif`
      };
    }
  }

  async createDepositWallet(currentUser) {
    try {
      /* TODO - remove true value to production */
      let depositWalletAddresses = await LunesLib.coins.createDepositWallet(currentUser.email, currentUser.accessToken, false);
      return depositWalletAddresses;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBalanceLunes(coin, currentUser) {
    try {
      const address = currentUser.wallet.coins[0].addresses[0].address;
      let balance = await LunesLib.coins.bitcoin.getBalance({ address }, currentUser.accessToken);
      return {
        COIN: 'LNS',
        CURRENTPRICE: balance
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  
  async getBalanceCoinETH(coin) {
    const toSymbol = this.$translate.instant('CURRENCY_USER');
    const currencySymbol = this.$translate.instant('CURRENCY_SYMBOL');
    const priceData = await axios.get(`https://braziliex.com/api/v1/public/ticker/eth_usd`, {});
    const price = parseFloat(priceData.data.last).toFixed(2);
    return {
      COIN: 'ETH',
      CURRENTPRICE: `${currencySymbol} ${price}`,
      DISPLAYPRICE: `1 ETH | ${price}`
    };
  }

  async buyHistory(email, accessToken) {
    const a = await LunesLib.ico.buyBalance(email, accessToken, 1).catch(error => {
      Interceptor.responseError(error);
    });
    return a;
  }

  async getBalance(coin, address, currentUser) {
    if (coin && address && currentUser) {
      let underCoin = coin.toLowerCase();
      let balance = await LunesLib.coins.getBalance({ address, coin: underCoin, testnet: false }, currentUser.accessToken).catch(error => {
        Interceptor.responseError(error);
      });
      return (balance && balance.data) ? balance.data : {};
    }
    return {};
  }

  async getBitcoinBalance(coin) {
    const toSymbol = 'USD';
    let queryObj = {
      fromSymbol: coin,
      toSymbol: toSymbol,
      exchange: this.$translate.instant('CURRENCY_EXCHANGE'),
    };
    var tsym = CCC.STATIC.CURRENCY.getSymbol(toSymbol);
    let priceData = await LunesLib.coins.getPrice(queryObj);
    const currentPrice = CCC.convertValueToDisplay(tsym, priceData[toSymbol]);
    const displayPrice = `1 ${coin} | ${currentPrice}`;
    let ticker = {
      DISPLAYPRICE: displayPrice,
      CURRENTPRICE: currentPrice,
      PRICE: priceData[toSymbol],
      CHANGE24HOUR: '-',
      CHANGEHOURPCT: '0%',
      CHANGE: 'up',
      COIN: coin,
    };
    return ticker;
  }

  getSeedWord() {
    let data = LunesLib.services.wallet.mnemonic.generateMnemonic();
    return data;
  }

  getAddress(seeds) {
    let data = LunesLib
      .services
      .wallet
      .lns
      .wallet
      .newAddress(seeds, LunesLib.networks.LNS);

    return data;
  } 

  async updateAddress(address, accessToken) {
    try {

      const updateData = { coin: 'LNS', address: address }

      let updateAddressResult = await LunesLib.coins.services.wallet.addAddress(
        updateData,
        accessToken
      );
      console.log(address)
      return updateAddressResult
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async sendBalance(accessToken) {
    try {
      console.log(accessToken)
      let data = await LunesLib.ico.sendUserBalance(accessToken);

      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getWithdraw(accessToken) {
    let data = await LunesLib.ico.verifyUserWithdraw(accessToken);

    return data;
  }


}

HttpService.$inject = ['$http', '$translate'];

export default HttpService;
