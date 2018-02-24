import { STORAGE_KEY } from '../constants/index';
import Countdown from '../utils/countdown';

class LoginController {
    constructor(HttpService, $state, $timeout, ErrorMessagesService) {
      this.$state = $state;
      this.$timeout = $timeout;
      this.currentPhase = [];
      this.HttpService = HttpService;
      this.ErrorMessagesService = ErrorMessagesService;
      this.user = {
          email: '',
          password: ''
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
        console.log("");
        if (!a.depositWallet || !a.depositWallet.BTC) {
          const depositWallet = await this.HttpService.createDepositWallet(a).catch(error => {
              if (error && error.response && error.response.data) {
                  alert(error.response.data.message)
              }
              console.log(error);
          });
          a.depositWallet = depositWallet;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
          this.$state.go('buy');
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
          this.$state.go('buy');
          console.log(a);
        }
      }
    }

    goToSignup() {
      this.$state.go('signup');
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
  
  LoginController.$inject = ['HttpService', '$state', '$timeout', 'ErrorMessagesService'];
  
  export default LoginController;
  