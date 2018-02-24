class SignupController {
    constructor($state, HttpService, $filter, $sce, $injector, $timeout, $translate) {
        this.$state = $state;
        this.$timeout = $timeout;
        this.HttpService = HttpService;
        this.$translate = $translate;
        this.showErrorForm = false;
        this.terms = $sce.trustAsHtml($filter('translate')('TERMS_CONDITIONS'));
        this.serverError = false;
        this.user = {
            name: '',
            lastname: '',
            email: '',
            confirmEmail: '',
            password: '',
            confirmPassword: '',
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
            testnet: true 
        };
        const a = await this.HttpService.signup(obj).catch(error => {
            this.serverError = true
            this.serverErrorMessage = error.message
            console.log(error);
        });
        if (a && a.accessToken) {
            this.serverError = false;
            this.serverErrorMessage = '';
            localStorage.setItem('lunes.accessToken', JSON.stringify(a));
            this.showLoading(false);
            this.notification(true);
        }
    }

    userIsValidToSignup() {
        return this.user.name && this.user.email && this.user.password && this.user.lastname && this.user.confirmEmail && this.user.confirmPassword;
    }

    allCheckboxIsChecked() {
        return this.user.check1 && this.user.check2 && this.user.check4;
    }

    showError() {
        this.showErrorForm = true;
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
  
  SignupController.$inject = ['$state', 'HttpService', '$filter', '$sce', '$injector', '$timeout', '$translate'];
  
  export default SignupController;
  