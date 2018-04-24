export default {
    'en':       'en',
    'en-US':    'en',
    'pt':       'pt',
    'pt-BR':    'pt',
}

exports.STORAGE_KEY = 'lunes.accessToken';
exports.RANDOM_KEY = 'lunes.randomKey';
exports.INTROJS_VIEWED_KEY = 'lunes.introjs.viewed';

exports.PERIOD = {
    RANGE_1D: 'RANGE_1D',
    RANGE_1W: 'RANGE_1W',
    RANGE_1M: 'RANGE_1M',
    RANGE_1Y: 'RANGE_1Y',
    RANGE_MAX: 'RANGE_MAX',
};

exports.COINS_CONSTANT = [{
  label: 'Bitcoin',
  name: 'BTC',
  img: 'https://res.cloudinary.com/luneswallet/image/upload/v1519442467/icon_btc.svg',
  selected: true
}, {
  label: 'Litecoin',
  name: 'LTC',
  img: 'https://res.cloudinary.com/luneswallet/image/upload/v1519442468/icon_ltc.svg',
  selected: false
}, {
  label: 'Ethereum',
  name: 'ETH',
  img: 'https://res.cloudinary.com/luneswallet/image/upload/v1519442467/icon_eth.svg',
  selected: false
}];