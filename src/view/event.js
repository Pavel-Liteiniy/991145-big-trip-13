import SmartView from "./smart";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const calculateTimeRange = (dateFrom, dateTo) => {
  dateFrom = dayjs(dateFrom);
  dateTo = dayjs(dateTo);

  const range = dayjs.duration(dateTo.diff(dateFrom));

  let format = `DD[D] HH[H] mm[M]`;

  if (range.days() === 0 && range.hours() === 0) {
    format = `mm[M]`;
  }

  if (range.days() === 0) {
    format = `HH[H] mm[M]`;
  }

  return range.format(format);
};

const createSelectedOffers = (offers) => {
  const items = offers.map((offer) => {
    return `<li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              +€&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </li>`;
  });

  return `<h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">${items.join(``)}</ul>`;
};

const createEvent = ({basePrice, dateFrom, dateTo, destination, isFavorite, offers, type}) => {
  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${dayjs(dateFrom).format(`YYYY-MM-DD`)}">${dayjs(dateFrom).format(`MMM DD`)}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${type} ${destination.name}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${dayjs(dateFrom).format(`YYYY-MM-DDTHH:mm`)}">${dayjs(dateFrom).format(`HH:mm`)}</time>
                  —
                  <time class="event__end-time" datetime="${dayjs(dateTo).format(`YYYY-MM-DDTHH:mm`)}">${dayjs(dateTo).format(`HH:mm`)}</time>
                </p>
                <p class="event__duration">${calculateTimeRange(dateFrom, dateTo)}</p>
              </div>
              <p class="event__price">
                €&nbsp;<span class="event__price-value">${basePrice}</span>
              </p>
              ${createSelectedOffers(offers)}
              <button class="event__favorite-btn  event__favorite-btn${isFavorite ? `--active` : ``}" type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
};

export default class Event extends SmartView {
  constructor(event) {
    super();
    this._data = event;

    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._tranformToEventEditorButtonClickHandler = this._tranformToEventEditorButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createEvent(this._data);
  }

  setFavoriteButtonClick(callback) {
    this._callback.favoriteButtonClick = callback;

    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteButtonClickHandler);
  }

  setTranformToEventEditorButtonClick(callback) {
    this._callback.editorButtonClick = callback;

    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._tranformToEventEditorButtonClickHandler);
  }

  restoreHandlers() {
    this.setFavoriteButtonClick(this._callback.favoriteButtonClick);
    this.setTranformToEventEditorButtonClick(this._callback.editorButtonClick);
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();

    this._data.isFavorite = !this._data.isFavorite;
    this._callback.favoriteButtonClick(this._data);
  }

  _tranformToEventEditorButtonClickHandler(evt) {
    evt.preventDefault();

    this._callback.editorButtonClick(this._data);
  }
}
