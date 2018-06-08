import { STORAGE_KEY } from '../constants/index';
import { RANDOM_KEY } from '../constants/index';
import smartlookClient from 'smartlook-client';
import Countdown from '../utils/countdown';

class LoginController {
    constructor($state, HttpService, $filter, $sce, $timeout, ErrorMessagesService) {
      this.$state = $state;
      this.$timeout = $timeout;
      this.currentPhase = [];
      this.HttpService = HttpService;
      this.termsCondition = $sce.trustAsHtml($filter('translate')('TERMS_CONDITIONS'));
      this.termsRepresentation = $sce.trustAsHtml($filter('translate')('REPRESENTATION_TERM'));
      this.ErrorMessagesService = ErrorMessagesService;
      this.loadingResetPass = false;
      this.preICOFinished = false;
      this.user = {
          email: '',
          password: '',
          check1: false,
          check2: false,
          check3: false,
          check4: false,
      };
      
      this.removeUser();

      this.obtainPhase().catch(error => {
        console.log(error);
      });
      Countdown();
      let randomKey;
      const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
      let userTrack
      if (!currentUser) {
          randomKey = localStorage.getItem(RANDOM_KEY);
          if (!randomKey) {
              randomKey = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
              localStorage.setItem(RANDOM_KEY, randomKey);
            }
          smartlookClient.identify(randomKey, { });
        } else {
          userTrack = { name: currentUser.fullname, email: currentUser.email, ownCoupon: currentUser.ownCoupon, coupon: currentUser.coupon, confirmIcoTerm: currentUser.confirmIcoTerm };
          if (currentUser.depositWallet && currentUser.depositWallet.BTC) {
            userTrack.btcAddress = currentUser.depositWallet.BTC.address;
            userTrack.ltcAddress = currentUser.depositWallet.LTC.address;
          }
          if (currentUser && currentUser._id) {
            smartlookClient.identify(currentUser._id, userTrack );
          } else {
            smartlookClient.identify(currentUser.email, userTrack );
          }
        }
    }

    removeUser() {
      localStorage.removeItem('lunes.accessToken');
      localStorage.removeItem('SEED');
    }

    async doLogin() {
      const self = this;

      this.showLoading(true);
      
      let userLogged = await this.HttpService.login(this.user).catch(error => {
        if (error && error.messageKey === 'NEED_PASS_TWOFA') {
          this.showFieldTwofa = true;
          return;
        }
        this.notification(true, error);
      });

      this.showLoading(false);

      if (userLogged.twofaEnabled) {
        this.userLoggedTemporary = JSON.parse(JSON.stringify(userLogged));
        this.authTwofaEmail = userLogged.email;
        this.$timeout(() => {
          $('#modal-verify-twofa').modal('show');
          self.showVerifyTwofa = true;
        }, 200);
      } else {
        this.redirectLogin(userLogged);
      }

      this.doAccept()
    }

    async redirectTwofa(userLogged) {
      const verify = await this.HttpService.verifyTwofa(this.authTwofaNumber, this.authTwofaEmail).catch(error => {
        this.showErrorMsgTwofaError = true;  
      });
      if (verify) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.userLoggedTemporary));
        this.userLoggedTemporary = null;
        this.$state.go('buy');
      }
    }

    async redirectLogin(userLogged) {
      if (userLogged && userLogged.accessToken) {

        this.showFieldTwofa = false;
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userLogged));

        if (userLogged.confirmIcoTerm) {
          if (!userLogged.depositWallet || !userLogged.depositWallet.BTC) {
            const depositWallet = await this.HttpService.createDepositWallet(userLogged).catch(error => {
                if (error && error.response && error.response.data) {
                    console.log(error);
                }
            });
            userLogged.depositWallet = depositWallet;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userLogged));
            this.$state.go('buy');
          } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userLogged));
            this.$state.go('buy');
          }
        } else {
          $('#modal-terms').modal('show');
          setTimeout(() => {
            document.getElementById("defaultOpen").click();
          }, 200);
        }
      }
    }

    async doChangePassword() {
      this.loadingResetPass = true;
      const a = await this.HttpService.changePassword(this.emailToChangePassword).catch(error => {
        this.loadingResetPass = false;
        this.$timeout(() => {
          this.showErrorMsgEmailSent = true;
        }, 200);
      });

      if (a && a.emailSent) {
        this.$timeout(() => {
          this.loadingResetPass = false;
          this.showMsgEmailSent = true;
        }, 200);
      }
    }

    goToSignup() {
      this.$state.go('signup');
    }

    allCheckboxIsChecked() {
        return this.user.check1 && this.user.check2 && this.user.check4;
    }

    async doAccept() {
        this.showLoading(true);
        this.currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
        const a = await this.HttpService.confirmterm(this.currentUser).catch(error => {
            this.serverError = true
            this.serverErrorMessage = error.message
            console.log(error);
        });
        if (!this.currentUser.depositWallet || !this.currentUser.depositWallet.BTC) {
          const depositWallet = await this.HttpService.createDepositWallet(this.currentUser).catch(error => {
              if (error && error.response && error.response.data) {
                  alert(error.response.data.message)
              }
              console.log(error);
          });
          this.currentUser.depositWallet = depositWallet;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
          this.$state.go('buy');
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser));
            this.$state.go('buy');
            console.log(this.currentUser);
          }
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

    async obtainPhase() {
      try {
        console.log("");
        this.currentPhase = await this.HttpService.obtainPhase().catch(error => {
          console.log(error);
        });
        if (this.currentPhase) {
          localStorage.setItem('lunes.phase', JSON.stringify(this.currentPhase));
        }
        this.showLoading(false);
      } catch (e) {
        console.log(e);
      }
    }

    notification(isShow, msg) {
      if (isShow) {
          let self = this;
        $(`<div class="modal-backdrop-error"><h4 style="margin-top: 10%;">${this.ErrorMessagesService.get(msg)}</h4><button class="close-error">ok</button></div>`).appendTo(document.body);
        $('.close-error').on('click', function() {
          $(".modal-backdrop-error").remove();
        });
      }
    }

  }

  LoginController.$inject = ['$state', 'HttpService', '$filter', '$sce', '$timeout', 'ErrorMessagesService'];

  export default LoginController;
