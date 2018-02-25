import { PERIOD } from '../constants';

class ErrorMessagesService {
  constructor($translate) {
    'ngInject';
    this.$translate = $translate;
  }

  get(msg) {
    try {
      if (msg && msg.message.indexOf("is not a valid email") !== -1) {
        msg = this.$translate.instant('AUTHENTICATE_INVALID');
      } else if (msg.messageKey === 'auth/user-not-found') {
        msg = this.$translate.instant('AUTHENTICATE_INVALID');
      } else if (msg.messageKey === 'auth/email-already-in-use') {
        msg = this.$translate.instant('EMAIL_ALREADY');
      } else if (msg.messageKey === 'auth/wrong-password') {
        msg = this.$translate.instant('AUTHENTICATE_INVALID');
      }
      return (msg && msg.messageKey) ? msg.messageKey : JSON.stringify(msg);
    } catch (e) {
      return this.$translate.instant('ERROR_SERVER');
    }
  }
}

ErrorMessagesService.$inject = ['$translate'];

export default ErrorMessagesService;
