import angular from 'angular';
import DateWrapperComponent from './date-wrapper/date-wrapper.component';
import DateSelectorComponent from './date-selector/date-selector.component';
import AirportComponent from './airport-selector/airport.component';
import InputAutocomplete from './input-autocomplete/input-autocomplete.component';
import LunesFooterContent from './lunesfooter/footer.component';
import Loading from './loading/loading.component';
import LunesHeaderComponent from './header/header.component';

export default angular.module('app.components', [])
.component('dateWrapper', DateWrapperComponent)
.component('dateSelector', DateSelectorComponent)
.component('airportSelect', AirportComponent)
.component('inputAutocomplete', InputAutocomplete)
.component('lunesfooter', LunesFooterContent)
.component('loading', Loading)
.component('lunesheader', LunesHeaderComponent)
.name;
