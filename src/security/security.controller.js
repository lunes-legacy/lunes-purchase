import { STORAGE_KEY, RANDOM_KEY } from '../constants/index';
import smartlookClient from 'smartlook-client';

class SecurityController {
  constructor($sce, $filter, $translate, $window) {
    this.faqText = $sce.trustAsHtml($filter('translate')('FAQ_TEXT'));
  }
}

  SecurityController.$inject = ['$sce', '$filter', '$translate', '$window'];

  export default SecurityController;
