import { STORAGE_KEY } from '../constants';

class APIInterceptorService {
  
  constructor($rootScope) {
    'ngInject';
    this.$rootScope = $rootScope;
  }

  request(config) {
    console.log(" ")
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.$rootScope.$broadcast('unauthorized');
    }
    return config;
  }

  responseError(response) {
    console.log(" ")
    if (response.status === 401) {
        this.$rootScope.$broadcast('unauthorized');
    }
    return response;  
  }
  
}

APIInterceptorService.$inject = ['$rootScope'];

export default APIInterceptorService;
