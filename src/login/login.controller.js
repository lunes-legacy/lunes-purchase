import { STORAGE_KEY } from '../constants/index';
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
      this.user = {
          email: '',
          password: '',
          check1: false,
          check2: false,
          check3: false,
          check4: false,
      };
      this.obtainPhase().catch(error => {
        console.log(error);
      });
      Countdown();
    }

    async doLogin() {
      this.showLoading(true);
      const a = await this.HttpService.login(this.user).catch(error => {
        this.notification(true, error);
      });
      this.showLoading(false);
      if (a && a.accessToken) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
        if (a.confirmIcoTerm) {
          if (!a.depositWallet || !a.depositWallet.BTC) {
            const depositWallet = await this.HttpService.createDepositWallet(a).catch(error => {
                if (error && error.response && error.response.data) {
                    console.log(error);
                }
            });
            a.depositWallet = depositWallet;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
            this.$state.go('buy');
          } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
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
          alert('Erro ao tentar recuperar dados da fase da ICO');  
        });
        console.log(this.currentPhase);
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
  