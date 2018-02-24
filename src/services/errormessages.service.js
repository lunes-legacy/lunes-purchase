import { PERIOD } from '../constants';

class ErrorMessagesService {
  constructor($translate) {
    'ngInject';
    this.$translate = $translate;
  }

  get(msg) {
    if ("asdasd is not a valid email.".indexOf("is not a valid email") !== -1) {
      msg = this.$translate.instant('AUTHENTICATE_INVALID');
    } else if (msg.messageKey === 'auth/user-not-found') {
      msg = this.$translate.instant('AUTHENTICATE_INVALID');
    }
    return msg;
  }
}

ErrorMessagesService.$inject = ['$translate'];

export default ErrorMessagesService;
