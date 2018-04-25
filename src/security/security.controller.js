import { STORAGE_KEY } from '../constants/index';
import smartlookClient from 'smartlook-client';

class SecurityController {
  constructor($translate, HttpService, $timeout) {
    this.HttpService = HttpService;
    this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
    this.$timeout = $timeout;
    this.numberTestAuthentication = '';
    this.renderQRCode();
  }
  async renderQRCode(generateNewQRCode) {
    if (!this.currentUser.twofaEnabled) {
      const base64Data = await this.HttpService.generateTwofa(this.currentUser.email, generateNewQRCode).catch(error => {
        console.log(error);
      });
      this.$timeout(() => {
        this.base64Img = base64Data.qrcode;
        this.currentTimestamp = base64Data.timestamp;
      }, 200);
    } else {
      this.currentUser.twofaEnabled = true;  
    }
  }

  generateAnotherQRCode() {
    this.currentUser.twofaEnabled = false;
    this.renderQRCode(true);
  }

  async validateAuthentication() {
    const verify = await this.HttpService.saveTwofa(this.numberTestAuthentication, this.currentTimestamp, this.currentUser.email).catch(error => {
      this.showErrorMsgTwofaError = true;  
    });
    if (verify && verify.twofaEnabled) {
      this.$timeout(() => {
        this.currentUser.twofaEnabled = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
      }, 200);
    } else {
      this.showErrorMsgTwofaError = true;  
    }
  }

}

SecurityController.$inject = ['$translate', 'HttpService', '$timeout'];

export default SecurityController;
