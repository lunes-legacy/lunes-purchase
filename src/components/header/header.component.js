import template from './header.component.html';
import controller from './header.controller';

const LunesHeaderComponent = {
  bindings: {
    showlinks: '=',
    balanceuser: '='
  },
  template,
  controller,
};

export default LunesHeaderComponent;
