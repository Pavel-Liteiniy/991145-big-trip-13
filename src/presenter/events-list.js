import {RenderPosition, UpdateType, SortType, FilterType} from "../const.js";
import {remove, render, replace} from "../utils/render.js";

import EventView from "../view/event.js";
import EventEditorView from "../view/event-editor.js";
import SortingView from "../view/sorting.js";
import EventListView from "../view/events-list.js";
import NoEventsPlugView from "../view/no-events-plug.js";
import LoadingPlugView from "../view/loading-plug.js";
import dayjs from 'dayjs';

export default class EventsList {
  constructor(container, pointsModel, offersModel, destinationsModel, filtersModel, api) {
    this._container = container;

    this._api = api;

    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._filtersModel = filtersModel;

    this._eventComponents = new Map();
    this._isLoaded = false;
    this._sortTypeSelected = SortType.BY_DAY;
    this._addEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);
    this._isAddEventButtonClicked = false;

    this._eventEditorCompoment = new EventEditorView();
    this._eventListComponent = new EventListView();
    this._sortingComponent = new SortingView(this._sortTypeSelected);
    this._noEventsPlugViewComponent = new NoEventsPlugView();
    this._loadingPlugComponent = new LoadingPlugView();

    this._changeEventFavoriteStatusHandler = this._changeEventFavoriteStatusHandler.bind(this);
    this._openEventEditorHandler = this._openEventEditorHandler.bind(this);
    this._closeEventEditorHandler = this._closeEventEditorHandler.bind(this);
    this._saveEditedEventHandler = this._saveEditedEventHandler.bind(this);
    this._deleteEditedEventHandler = this._deleteEditedEventHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._addEventButtonHandler = this._addEventButtonHandler.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleOffersModelEvent = this._handleOffersModelEvent.bind(this);
    this._handleDestinationsModelEvent = this._handleDestinationsModelEvent.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleOffersModelEvent);
    this._destinationsModel.addObserver(this._handleDestinationsModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);

    this._addEventButtonElement.addEventListener(`click`, this._addEventButtonHandler);

    if (!this._isLoaded) {
      render(this._container, this._loadingPlugComponent);
      this._addEventButtonElement.disabled = true;
      return;
    }

    if (this._getPoints().length > 0 || this._isAddEventButtonClicked) {
      this._sortingComponent.sortTypeSelected = this._sortTypeSelected;
      this._sortingComponent.setSortTypeChange(this._sortTypeChangeHandler);

      render(this._container, this._sortingComponent);
      render(this._container, this._eventListComponent);

      this._getPoints().forEach((point) => {
        const eventComponent = new EventView(Object.assign(
            {},
            point,
            {offers: point.offers},
            {destination: point.destination}
        ));

        eventComponent.setFavoriteButtonClick(this._changeEventFavoriteStatusHandler);
        eventComponent.setTranformToEventEditorButtonClick(this._openEventEditorHandler);

        this._eventComponents.set(point.id, eventComponent);

        render(this._eventListComponent, eventComponent);
      });
    } else {
      render(this._container, this._noEventsPlugViewComponent);
    }
  }

  _clearList() {
    if (!this._isLoaded) {
      remove(this._loadingPlugComponent);
      this._addEventButtonElement.disabled = false;
      return;
    }

    remove(this._sortingComponent);

    if (this._container.contains(this._eventListComponent.getElement())) {
      remove(this._eventListComponent);
    }

    if (this._container.contains(this._noEventsPlugViewComponent.getElement())) {
      remove(this._noEventsPlugViewComponent);
    }

    this._eventComponents.clear();
  }

  _getPoints() {
    let points = this._pointsModel.collection;

    if (this._filtersModel.selected !== FilterType.EVERYTHING) {
      points = points.filter((point) => {
        let isFiltered;
        switch (this._filtersModel.selected) {
          case FilterType.FUTURE:
            isFiltered = dayjs(point.dateFrom).diff(dayjs()) >= 0;
            break;
          case FilterType.PAST:
            isFiltered = dayjs().diff(dayjs(point.dateFrom)) > 0;
            break;
        }

        return isFiltered;
      });
    }

    switch (this._sortTypeSelected) {
      case SortType.BY_DAY:
        points.sort((a, b) => {
          return dayjs(a.dateFrom).diff(dayjs(b.dateFrom));
        });
        break;
      case SortType.BY_TIME:
        points.sort((a, b) => {
          const firstItemDateFrom = dayjs(a.dateFrom);
          const firstItemDateTo = dayjs(a.dateTo);

          const secondItemDateFrom = dayjs(b.dateFrom);
          const secondItemDateTo = dayjs(b.dateTo);

          return secondItemDateTo.diff(secondItemDateFrom) - firstItemDateTo.diff(firstItemDateFrom);
        });
        break;
      case SortType.BY_PRICE:
        points.sort((a, b) => {
          return b.basePrice - a.basePrice;
        });
        break;
    }

    return points;
  }

  _changeEventFavoriteStatusHandler(point) {
    this._api.updatePoint(point)
      .then((updatedData) => {
        this._pointsModel.updatePoint(UpdateType.PATCH, updatedData);
      })
      .catch(() => {
        throw Error(`Can't update point`);
      });
  }

  _openEventEditorHandler(point) {
    if (this._eventEditorCompoment.point !== null) {

      if (this._eventEditorCompoment.point.hasOwnProperty(`id`)) {
        replace(this._eventComponents.get(this._eventEditorCompoment.point.id), this._eventEditorCompoment);
      }

      remove(this._eventEditorCompoment);
    }

    this._eventEditorCompoment.point = point;
    this._eventEditorCompoment.setTransformToEventButtonClick(this._closeEventEditorHandler);
    this._eventEditorCompoment.setSaveButtonClick(this._saveEditedEventHandler);
    this._eventEditorCompoment.setDeleteButtonClick(this._deleteEditedEventHandler);

    if (!point.hasOwnProperty(`id`)) {
      render(this._eventListComponent, this._eventEditorCompoment, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._eventEditorCompoment, this._eventComponents.get(point.id));
  }

  _closeEventEditorHandler(point) {
    replace(this._eventComponents.get(point.id), this._eventEditorCompoment);
    remove(this._eventEditorCompoment);
    this._eventEditorCompoment.point = null;
  }

  _saveEditedEventHandler(point) {
    if (!point.hasOwnProperty(`id`)) {
      this._api.addPoint(point)
        .then((newPoint) => {
          this._pointsModel.addPoint(UpdateType.MAJOR, newPoint);
        })
        .catch(() => {
          throw Error(`Can't save new point`);
        });

      this._isAddEventButtonClicked = !this._isAddEventButtonClicked;
      return;
    }

    this._api.updatePoint(point)
      .then((updatedData) => {
        this._pointsModel.updatePoint(UpdateType.MINOR, updatedData);
      })
      .catch(() => {
        throw Error(`Can't save edited point`);
      });
  }

  _deleteEditedEventHandler(point) {
    if (!point.hasOwnProperty(`id`)) {
      if (this._getPoints().length === 0) {
        remove(this._sortingComponent);
      }

      remove(this._eventEditorCompoment);
      this._eventEditorCompoment.point = null;
      this._isAddEventButtonClicked = !this._isAddEventButtonClicked;
      return;
    }

    this._api.deletePoint(point)
      .then(() => {
        this._pointsModel.deletePoint(UpdateType.MINOR, point);
      })
      .catch(() => {
        throw Error(`Can't delete point`);
      });
  }

  _sortTypeChangeHandler(newSortType) {
    if (this._sortTypeSelected !== newSortType) {
      this._sortTypeSelected = newSortType;
      this._sortingComponent.sortTypeSelected = this._sortTypeSelected;

      this._clearList();
      this.init();
    }
  }

  _handleModelEvent(updateType, updatedData) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventComponents.get(updatedData.id).updateData(updatedData);
        break;
      case UpdateType.MINOR:
        remove(this._eventEditorCompoment);
        this._eventEditorCompoment.point = null;
        this._clearList();
        this._isAddEventButtonClicked = false;
        this.init();
        break;
      case UpdateType.MAJOR:
        this._clearList();
        this._sortTypeSelected = SortType.BY_DAY;
        this._isAddEventButtonClicked = false;
        this.init();
        break;
      case UpdateType.INIT:
        this._clearList();

        this._isLoaded = true;
        remove(this._loadingPlugComponent);

        this.init();
        break;
    }
  }

  _handleOffersModelEvent(updateType, updatedData) {
    switch (updateType) {
      case UpdateType.INIT:
        this._eventEditorCompoment.offers = updatedData;
        break;
    }
  }

  _handleDestinationsModelEvent(updateType, updatedData) {
    switch (updateType) {
      case UpdateType.INIT:
        this._eventEditorCompoment.destinations = updatedData;
        break;
    }
  }

  _addEventButtonHandler(evt) {
    evt.preventDefault();

    if (this._isAddEventButtonClicked) {
      remove(this._eventEditorCompoment);
      this._eventEditorCompoment.point = null;
      this._isAddEventButtonClicked = !this._isAddEventButtonClicked;

      this._clearList();
      this.init();

      return;
    }

    this._isAddEventButtonClicked = !this._isAddEventButtonClicked;

    const emptyPoint = {
      basePrice: -1,
      dateFrom: dayjs(),
      dateTo: dayjs(),
      destination: null,
      isFavorite: false,
      offers: [],
      type: this._offersModel.collection[0].type,
    };

    if (this._getPoints().length === 0) {
      this._clearList();
      this.init();
    }

    this._openEventEditorHandler(emptyPoint);
  }
}
