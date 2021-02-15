import SmartView from "./smart.js";
import {FilterType} from "../const.js";


const createControls = (filterSelected) => {
  return `<div>
            <h2 class="visually-hidden">Switch trip view</h2>
            <nav class="trip-controls__trip-tabs  trip-tabs">
              <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
              <a class="trip-tabs__btn" href="#">Stats</a>
            </nav>

            <h2 class="visually-hidden">Filter events</h2>
            <form class="trip-filters" action="#" method="get">
              <div class="trip-filters__filter">
                <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything"${filterSelected === FilterType.EVERYTHING ? ` checked=""` : ``}>
                <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
              </div>

              <div class="trip-filters__filter">
                <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future"${filterSelected === FilterType.FUTURE ? ` checked=""` : ``}>
                <label class="trip-filters__filter-label" for="filter-future">Future</label>
              </div>

              <div class="trip-filters__filter">
                <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past"${filterSelected === FilterType.PAST ? ` checked=""` : ``}>
                <label class="trip-filters__filter-label" for="filter-past">Past</label>
              </div>

              <button class="visually-hidden" type="submit">Accept filter</button>
            </form>
          </div>`;
};

export default class Controls extends SmartView {
  constructor(filterSelected) {
    super();
    this._data.filterSelected = filterSelected;

    this._changeFilterHandler = this._changeFilterHandler.bind(this);
  }

  set filterSelected(filterType) {
    this._data.filterSelected = filterType;
  }

  get filterSelected() {
    return this._data.filterSelected;
  }

  getTemplate() {
    return createControls(this._data.filterSelected);
  }

  setChangeFilterHandler(callback) {
    this._callback.changeFilter = callback;

    this.getElement().querySelector(`.trip-filters`).addEventListener(`change`, this._changeFilterHandler);
  }

  _changeFilterHandler(evt) {
    evt.preventDefault();

    this._callback.changeFilter(evt.target.value);
  }

  restoreHandlers() {
    this.getElement().querySelector(`.trip-filters`).addEventListener(`change`, this._changeFilterHandler);
  }
}
