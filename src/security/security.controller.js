import { STORAGE_KEY } from '../constants/index';
import smartlookClient from 'smartlook-client';

class SecurityController {
  constructor($translate, HttpService) {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
    this.base64Img = HttpService.generateTwofa(currentUser.email);
  }
}

  SecurityController.$inject = ['$translate', 'HttpService'];

  export default SecurityController;
