import { STORAGE_KEY } from '../constants/index';
class SignupController {
    constructor($state, HttpService, $filter, $sce, $injector, $timeout, $translate, ErrorMessagesService) {
        this.$state = $state;
        this.$timeout = $timeout;
        this.HttpService = HttpService;
        this.$translate = $translate;
        this.ErrorMessagesService = ErrorMessagesService;
        this.showErrorForm = false;
        this.termsCondition = $sce.trustAsHtml($filter('translate')('TERMS_CONDITIONS'));
        this.termsRepresentation = $sce.trustAsHtml($filter('translate')('REPRESENTATION_TERM'));
        this.serverError = false;
        this.user = {
            name: '',
            lastname: '',
            email: '',
            confirmEmail: '',
            password: '',
            confirmPassword: '',
            coupon: '',
            check1: false,
            check2: false,
            check3: false,
            check4: false,
        };
    }

    async doSignup() {
        this.showLoading(true);
        const obj = { 
            name: this.user.name, 
            lastname: this.user.lastname, 
            email: this.user.email,
            password: this.user.password,
            coupon: this.user.coupon,
            testnet: true
        };
        const a = await this.HttpService.signup(obj).catch(error => {
            //this.serverError = true
            //this.serverErrorMessage = error.message
            this.notificationError(true, error);
        });
        if (a && a.accessToken) {
            this.serverError = false;
            this.serverErrorMessage = '';
            localStorage.setItem('lunes.accessToken', JSON.stringify(a));
            this.showLoading(false);
            const b = await this.HttpService.confirmterm(a).catch(error => {
                this.serverError = true
                this.serverErrorMessage = error.message
                console.log(error);
            });
            if (!a.depositWallet || !a.depositWallet.BTC) {
                const depositWallet = await this.HttpService.createDepositWallet(a).catch(error => {
                    if (error && error.response && error.response.data) {
                        alert(error.response.data.message)
                    }
                    console.log(error);
                });
                a.depositWallet = depositWallet;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
                this.$state.go('historic');
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
                this.$state.go('historic');
                console.log(a);
            }
        }

    }

    userIsValidToSignup() {
        return this.user.name && this.user.email && this.user.password && this.user.lastname && this.user.confirmEmail && this.user.confirmPassword;
    }

    enableTab() {
      setTimeout(() => {
        document.getElementById("defaultOpen").click();
      }, 200);
    }

    allCheckboxIsChecked() {
        return this.user.check1 && this.user.check2 && this.user.check4;
    }

    showError() {
        this.showErrorForm = true;
    }

    goToLogin() {
      this.$state.go('login');
    }

    showLoading(isShow) {
      if (isShow) {
        this.notification(false);
        $(`<div class="modal-backdrop"><img src="https://res.cloudinary.com/luneswallet/image/upload/v1519442469/loading_y9ob8i.svg" /></div>`).appendTo(document.body);
      } else {
        this.$timeout(function() {
          $(".modal-backdrop").remove();
        }, 1000);
      }
    }

    notificationError(isShow, msg) {
      if (isShow) {
        let self = this;
        $(`<div class="modal-backdrop-error"><h4 style="margin-top: 10%;">${this.ErrorMessagesService.get(msg)}</h4><button class="close-error">ok</button></div>`).appendTo(document.body);
        $('.close-error').on('click', function() {
          $(".modal-backdrop-error").remove();   
        });
      }
    }

    notification(isShow) {
      if (isShow) {
          let self = this;
        $(`<div class="modal-backdrop"><h4>${this.$translate.instant('SIGNUP_SUCCESSFULY')}</h4><br /><p>${this.$translate.instant('REDIRECTING')}</p></div>`).appendTo(document.body);
        this.$timeout(function() {
          self.notification(false);
          self.$state.go('login');
        }, 5000);
      } else {
        this.$timeout(function() {
          $(".modal-backdrop").remove();
        }, 1000);
      }
    }
  }
  
  SignupController.$inject = ['$state', 'HttpService', '$filter', '$sce', '$injector', '$timeout', '$translate', 'ErrorMessagesService'];
  
  export default SignupController;
  