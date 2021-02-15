import SmartView from "./smart.js";
import {deleteItem} from "../utils/common.js";

import he from "he";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import {Russian} from "flatpickr/dist/l10n/ru.js";

dayjs.extend(duration);

const EventTimeName = {
  START: `event-start-time`,
  END: `event-end-time`,
};

const createOffers = (offers, type, offersList) => {
  const matchedOffer = offersList.find((item) => {
    return item.type === type;
  });

  if (matchedOffer.offers.length === 0) {
    return ``;
  }

  const markedOffers = matchedOffer.offers.map((markedOffer) => {
    return Object.assign(
        {},
        markedOffer,
        {
          isChecked: offers.some((offer) => {
            return markedOffer.title.toLowerCase() === offer.title.toLowerCase();
          })
        }
    );
  });

  const items = markedOffers.map((offer, index) => {
    return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" data-offer="${offer.title.toLowerCase()}" name="event-offer-${index}"${offer.isChecked ? ` checked=""` : ``}>
              <label class="event__offer-label" for="event-offer-${index}">
                <span class="event__offer-title">${offer.title}</span>
                +€&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>`;
  });

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${items.join(``)}
            </div>
          </section>`;
};

const createDestination = (destination) => {
  if (destination === null) {
    return ``;
  }

  const createDestinationImages = (pictures) => {
    const items = pictures.map((picture) => {
      return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    });

    return `<div class="event__photos-container">
              <div class="event__photos-tape">
                ${items.join(``)}
              </div>
            </div>`;
  };


  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">
              ${destination.description}
            </p>
            ${destination.pictures.length > 0 ? createDestinationImages(destination.pictures) : ``}
          </section>`;
};

const createDestinationList = (id, destinationsList) => {
  const items = destinationsList.map((destination) => {
    return `<option value="${destination.name}"></option>`;
  });
  return `<datalist id="destination-list-${id}">
            ${items.join(``)}
          </datalist>`;
};

const createEventTypeList = (id, type, offersList) => {
  const items = offersList.map((offer) => {
    return `<div class="event__type-item">
              <input id="event-type-${offer.type.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type.toLowerCase()}"${type.toLowerCase() === offer.type.toLowerCase() ? ` checked=""` : ``}>
              <label class="event__type-label  event__type-label--${offer.type.toLowerCase()}" for="event-type-${offer.type.toLowerCase()}-${id}">${offer.type[0].toUpperCase() + offer.type.slice(1)}</label>
            </div>`;
  });

  return `<div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${items.join(``)}
            </fieldset>
          </div>`;
};

const createEvent = ({basePrice = -1, dateFrom = dayjs(), dateTo = dayjs(), destination = null, id = `new-event`, offers = [], type = `taxi`}, offersList, destinationsList) => {
  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
                  ${createEventTypeList(id, type, offersList)}
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-${id}">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination === null ? `` : destination.name}" list="destination-list-${id}">
                  ${createDestinationList(id, destinationsList)}
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-${id}">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${he.encode(dayjs(dateFrom).format(`DD/MM/YY HH:mm`))}">
                  —
                  <label class="visually-hidden" for="event-end-time-${id}">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${he.encode(dayjs(dateTo).format(`DD/MM/YY HH:mm`))}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-${id}">
                    <span class="visually-hidden">Price</span>
                    €
                  </label>
                  <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice < 0 ? `` : he.encode(basePrice.toString())}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                ${id !== `new-event` ? `<button class="event__rollup-btn" type="button">
                                    <span class="visually-hidden">Open event</span>
                                  </button>` : ``}
              </header>
              <section class="event__details">
                ${createOffers(offers, type, offersList)}
                ${createDestination(destination)}
              </section>
            </form>
          </li>`;
};

export default class EventEditor extends SmartView {
  constructor() {
    super();

    this._data = null;
    this._datepicker = null;

    this._transformToEventButtonClickHandler = this._transformToEventButtonClickHandler.bind(this);
    this._saveButtonClickHandler = this._saveButtonClickHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._timeFocusHandler = this._timeFocusHandler.bind(this);
  }

  get point() {
    if (this._data === null) {
      return null;
    }

    return Object.assign(
        {},
        this._data
    );
  }

  set point(data) {
    if (data === null) {
      this._data = null;
      return;
    }

    this._data = Object.assign(
        {},
        data
    );

    this.setInnerHandlers();
  }

  set offers(offers) {
    this._offers = offers;
  }

  set destinations(destinations) {
    this._destinations = destinations;
  }

  getTemplate() {
    return createEvent(this._data, this._offers, this._destinations);
  }

  setTransformToEventButtonClick(callback) {
    this._callback.transformToEventButtonClick = callback;

    if (!this._data.hasOwnProperty(`id`)) {
      return;
    }

    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._transformToEventButtonClickHandler);
  }

  setSaveButtonClick(callback) {
    this._callback.saveButtonClick = callback;

    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._saveButtonClickHandler);
  }

  setDeleteButtonClick(callback) {
    this._callback.deleteButtonClick = callback;

    this.getElement().querySelector(`.event--edit`).addEventListener(`reset`, this._deleteButtonClickHandler);
  }

  setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._typeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceChangeHandler);
    this.getElement().querySelector(`.event__details`).addEventListener(`change`, this._offersChangeHandler);
    this.getElement().querySelector(`.event__field-group--time`).addEventListener(`focusin`, this._timeFocusHandler);
  }

  restoreHandlers() {
    this.setInnerHandlers();

    this.setSaveButtonClick(this._callback.saveButtonClick);
    this.setDeleteButtonClick(this._callback.deleteButtonClick);
    this.setTransformToEventButtonClick(this._callback.transformToEventButtonClick);
  }

  _transformToEventButtonClickHandler(evt) {
    evt.preventDefault();

    this._callback.transformToEventButtonClick(this._data);
  }

  _saveButtonClickHandler(evt) {
    evt.preventDefault();

    if (dayjs(this._data.dateTo).diff(dayjs(this._data.dateFrom)) < 0) {
      this.getElement().querySelector(`.event__input--time[name="event-end-time"]`).setCustomValidity(`Дата окончания не может быть меньше даты начала события`);
      return;
    }

    if (this._data.destination === null) {
      this.getElement().querySelector(`.event__input--destination`).setCustomValidity(`Выберете из предложенных вариантов`);
      return;
    }

    if (this._data.basePrice === -1) {
      this.getElement().querySelector(`.event__input--price`).setCustomValidity(`Введите базовую стоимость`);
      return;
    }

    this._callback.saveButtonClick(this._data);
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();

    this._callback.deleteButtonClick(this._data);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();

    this.updateData(
        {
          type: evt.target.value,
          offers: [],
        }
    );
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const getCheckedDestination = (checkedDestinationName) => {
      const index = this._destinations.findIndex((destination) => {
        return checkedDestinationName.toLowerCase() === destination.name.toLowerCase();
      });

      return this._destinations[index] || null;
    };

    const checkedDestination = getCheckedDestination(evt.target.value);

    this.updateData({destination: checkedDestination});
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();

    evt.target.value = evt.target.value.replaceAll(/(^0|\D)/g, ``);

    if (evt.target.value.length === 0) {
      evt.target.value = 0;
    }

    evt.target.setCustomValidity(``);

    this.updateData({basePrice: Number(evt.target.value)}, true);
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.checked) {
      const offersList = this._offers.find((offer) => {
        return offer.type === this._data.type;
      });

      const newOffer = offersList.offers.find((offer) => {
        return offer.title.toLowerCase() === evt.target.dataset.offer;
      });

      this.updateData({offers: [...this._data.offers, newOffer]}, true);
    } else {
      const index = this._data.offers.findIndex((offer) => {
        return offer.title.toLowerCase() === evt.target.dataset.offer;
      });

      this.updateData({offers: deleteItem(this._data.offers, index)}, true);
    }

  }

  _timeFocusHandler(evt) {
    evt.preventDefault();

    this._setDatepicker(evt);
  }

  _setDatepicker(evt) {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    const updateDate = ([userDate]) => {

      if (evt.target.name === EventTimeName.START) {
        this.updateData({dateFrom: dayjs(userDate).format(`YYYY-MM-DDTHH:mm:ss.SSS`)}, true);
        return;
      }

      this.updateData({dateTo: dayjs(userDate).format(`YYYY-MM-DDTHH:mm:ss.SSS`)}, true);
    };

    this._datepicker = flatpickr(
        evt.target,
        {
          dateFormat: `d/m/y H:i`,
          locale: Russian,
          enableTime: true,
          onChange: updateDate,
        }
    );
  }
}
