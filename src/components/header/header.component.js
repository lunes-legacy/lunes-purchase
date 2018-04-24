import template from './header.component.html';
import controller from './header.controller';
import './header.component.scss';

const LunesHeaderComponent = {
  bindings: {
    showlinks: '=',
    balanceuser: '='
  },
  template,
  controller,
};

export default LunesHeaderComponent;
