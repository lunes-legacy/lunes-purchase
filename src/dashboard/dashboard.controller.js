class DashboardController {
  constructor(HttpService) {
    this.HttpService = HttpService;
  }
}

DashboardController.$inject = ['HttpService'];

export default DashboardController;
