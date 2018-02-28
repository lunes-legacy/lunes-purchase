import angular from 'angular';
import uiRouter from 'angular-ui-router';
import I18n from 'angular-translate';
import Components from './components/components';
import LoginComponent from './login/login.component';
import SignupComponent from './signup/signup.component';
import BuyComponent from './buy/buy.component';
import DashboardComponent from './dashboard/dashboard.component';
import FixComponent from './fix/fix.component';
import languageUtil from './utils/language';
import en from './constants/en';
import pt from './constants/pt';
import { STORAGE_KEY } from './constants/index';

import {
  CheapFlightService,
  HttpService,
  ErrorMessagesService,
  APIInterceptorService
} from './services';
import './scss/main.scss';

angular.module('myApp', [
  uiRouter,
  Components,
  I18n,
])
.service('HttpService', HttpService)
.service('ErrorMessagesService', ErrorMessagesService)
.service('CheapFlightService', CheapFlightService)
.service('APIInterceptor', APIInterceptorService)
.component('loginPage', LoginComponent)
.component('signupPage', SignupComponent)
.component('buyPage', BuyComponent)
.component('dashboardPage', DashboardComponent)
.component('fixPage', FixComponent)
.directive('comparePassword', function () {
        return {
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.comparePassword = function(modelValue) {

                if (ngModel.$isEmpty(modelValue) || ngModel.$$parentForm.confirmPassword.$viewValue === '') {
                  // consider empty models to be valid
                  return true;
                }

                    return ngModel.$$parentForm.password.$viewValue === ngModel.$$parentForm.confirmPassword.$viewValue;
                };

                ngModel.$validate()
            }
        };
    }
)
.directive('compareEmail', function () {

  return {
      require: "ngModel",
      link: function(scope, element, attributes, ngModel) {

          ngModel.$validators.compareEmail = function(modelValue) {
            if (ngModel.$isEmpty(modelValue) || ngModel.$$parentForm.confirmEmail.$viewValue === '') {
              // consider empty models to be valid
              return true;
            }

            return ngModel.$$parentForm.email.$viewValue === ngModel.$$parentForm.confirmEmail.$viewValue;
          };
          ngModel.$validate();
      }
  };
}
)
.config(($stateProvider, $translateProvider, $urlRouterProvider, $httpProvider) => {
  'ngInject';

  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
  $httpProvider.interceptors.push('APIInterceptor');
  $translateProvider.translations('en', en);
  $translateProvider.translations('pt', pt);
  $translateProvider.preferredLanguage(languageUtil());
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('signup', {
      url: '/signup',
      template: '<signup-page></signup-page>',
    })
    .state('login', {
      url: '/login',
      template: '<login-page></login-page>',
    })
    .state('buy', {
      url: '/buy',
      template: '<buy-page></buy-page>',
    })
    .state('historic', {
      url: '/historic',
      template: '<dashboard-page></dashboard-page>',
    })
    .state('home', {
      url: '/',
      template: '<login-page></login-page>',
    });
    /*.state('fix', {
      url: '/',
      template: '<fix-page></fix-page>',
    });*/
})
;
