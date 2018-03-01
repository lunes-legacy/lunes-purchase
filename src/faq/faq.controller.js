class FAQController {
    constructor($sce, $filter) {
      this.faqText = $sce.trustAsHtml($filter('translate')('FAQ_TEXT'));
    }
  }

  FAQController.$inject = ['$sce', '$filter'];

  export default FAQController;
