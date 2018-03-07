import { STORAGE_KEY, RANDOM_KEY } from '../constants/index';
import smartlookClient from 'smartlook-client';
class FAQController {
    constructor($sce, $filter, $translate, $window) {
      this.faqText = $sce.trustAsHtml($filter('translate')('FAQ_TEXT'));
      this.questions = [{
        question: $translate.instant('WHATS_LUNES'),
        answer: $translate.instant('WHATS_LUNES_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_01'),
        answer: $translate.instant('DOUBT_01_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_02'),
        answer: $translate.instant('DOUBT_02_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_03'),
        answer: $translate.instant('DOUBT_03_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_04'),
        answer: $translate.instant('DOUBT_04_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_05'),
        answer: $translate.instant('DOUBT_05_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_06'),
        answer: $translate.instant('DOUBT_06_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_07'),
        answer: $translate.instant('DOUBT_07_A'),
        items: [{
          translate: 'ITEM_07_1',
          value: '$ 0.01'
        }, {
          translate: 'ITEM_07_2',
          value: '$ 0.08'
        }, {
          translate: 'ITEM_07_3',
          value: '$ 0.15'
        }, {
          translate: 'ITEM_07_4',
          value: '$ 0.30'
        }],
        show: false
      }, {
        question: $translate.instant('DOUBT_08'),
        answer: $sce.trustAsHtml($filter('translate')('DOUBT_08_A')),
        show: false
      }, {
        question: $translate.instant('DOUBT_09'),
        answer: $translate.instant('DOUBT_09_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_10'),
        answer: $translate.instant('DOUBT_10_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_11'),
        answer: $translate.instant('DOUBT_11_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_12'),
        answer: $translate.instant('DOUBT_12_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_13'),
        answer: $translate.instant('DOUBT_13_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_14'),
        answer: $translate.instant('DOUBT_14_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_15'),
        answer: $translate.instant('DOUBT_15_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_16'),
        answer: $translate.instant('DOUBT_16_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_17'),
        answer: $translate.instant('DOUBT_17_A'),
        show: false
      }, {
        question: $translate.instant('DOUBT_18'),
        answer: $translate.instant('DOUBT_18_A'),
        show: false
      }];

      // scroll to top page
      $window.scrollTo(0, 0);

      let randomKey;
      const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY));
      let userTrack;
      if (!currentUser) {
          randomKey = localStorage.getItem(RANDOM_KEY);
          if (!randomKey) {
              randomKey = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
              localStorage.setItem(RANDOM_KEY, randomKey);
            }
          smartlookClient.identify(randomKey, { });
        } else {
          userTrack = { name: currentUser.fullname, email: currentUser.email, ownCoupon: currentUser.ownCoupon, coupon: currentUser.coupon, confirmIcoTerm: currentUser.confirmIcoTerm };
          if(currentUser.depositWallet){
            userTrack.btcAddress = currentUser.depositWallet.BTC.address;
            userTrack.ltcAddress = currentUser.depositWallet.LTC.address;
            userTrack.ethAddress = currentUser.depositWallet.ETH.address;
          }
          smartlookClient.identify(currentUser._id, userTrack );
        }

    }

    open(question) {
      this.questions = this.questions.map(q => {
        if (question.question !== q.question) {
          q.show = false;
        }
        return q;
      });
      question.show = !question.show;
    }
  }

  FAQController.$inject = ['$sce', '$filter', '$translate', '$window'];

  export default FAQController;
