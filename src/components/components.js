import angular from 'angular';
import DateWrapperComponent from './date-wrapper/date-wrapper.component';
import DateSelectorComponent from './date-selector/date-selector.component';
import AirportComponent from './airport-selector/airport.component';
import InputAutocomplete from './input-autocomplete/input-autocomplete.component';
import PopContent from './pop-content/pop-content.component';
import Loading from './loading/loading.component';

export default angular.module('app.components', [])
.component('dateWrapper', DateWrapperComponent)
.component('dateSelector', DateSelectorComponent)
.component('airportSelect', AirportComponent)
.component('inputAutocomplete', InputAutocomplete)
.component('popContent', PopContent)
.component('loading', Loading)
.name;
