import template from './header.component.html';
import controller from './header.controller';

const LunesHeaderComponent = {
  bindings: {
    coin: '=',
    price: '=',
    showlinks: '=',
    showlogout: '='
  },
  template,
  controller,
};

export default LunesHeaderComponent;
