import { STORAGE_KEY } from '../constants/index';
import smartlookClient from 'smartlook-client';

class SecurityController {
  constructor($translate, HttpService, $timeout) {
    this.HttpService = HttpService;
    this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
    this.$timeout = $timeout;
    this.renderQRCode();
  }
  async renderQRCode(generateNewQRCode) {
    const base64Data = await this.HttpService.generateTwofa(this.currentUser.email, generateNewQRCode).catch(error => {
      console.log(error);
    });
    this.$timeout(() => {
      this.base64Img = base64Data;
    }, 200);
  }

  generateAnotherQRCode() {
    this.currentUser.twofaEnabled = false;
    this.renderQRCode(true);
  }

}

SecurityController.$inject = ['$translate', 'HttpService', '$timeout'];

export default SecurityController;
