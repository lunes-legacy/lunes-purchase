import { PERIOD } from '../constants';

class ErrorMessagesService {
  constructor($translate) {
    'ngInject';
    this.$translate = $translate;
  }

  get(msg) {
    if (msg && msg.message.indexOf("is not a valid email") !== -1) {
      msg = this.$translate.instant('AUTHENTICATE_INVALID');
    } else if (msg.messageKey === 'auth/user-not-found') {
      msg = this.$translate.instant('AUTHENTICATE_INVALID');
    } else if (msg.messageKey === 'auth/email-already-in-use') {
      msg = this.$translate.instant('EMAIL_ALREADY');
    } else if (msg.messageKey === 'auth/wrong-password') {
      msg = this.$translate.instant('AUTHENTICATE_INVALID');
    }
    return msg;
  }
}

ErrorMessagesService.$inject = ['$translate'];

export default ErrorMessagesService;
