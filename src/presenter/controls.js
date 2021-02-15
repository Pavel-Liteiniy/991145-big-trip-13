import {RenderPosition, UpdateType, FilterType} from "../const.js";
import {remove, render} from "../utils/render.js";

import ControlsView from "../view/controls.js";
import TripInfoView from "../view/trip-info.js";

export default class Controls {
  constructor(container, pointsModel, filtersModel) {
    this._container = container;
    this._controlsElement = this._container.querySelector(`.trip-main__trip-controls`);
    this._filterSelected = FilterType.EVERYTHING;

    this._pointsModel = pointsModel;
    this._filtersModel = filtersModel;

    this._controlsComponent = new ControlsView(this._filterSelected);
    this._tripInfoComponent = new TripInfoView();

    this._handlePointsModelEvent = this._handlePointsModelEvent.bind(this);
    this._handleFiltersModelEvent = this._handleFiltersModelEvent.bind(this);
    this._changeFilterHandler = this._changeFilterHandler.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handlePointsModelEvent);
    this._filtersModel.addObserver(this._handleFiltersModelEvent);
    this._controlsComponent.setChangeFilterHandler(this._changeFilterHandler);
    render(this._controlsElement, this._controlsComponent);
  }

  _handlePointsModelEvent(updateType, updatedData) {
    switch (updateType) {
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        remove(this._tripInfoComponent);
        this._tripInfoComponent.points = this._pointsModel.collection;
        render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
        break;
      case UpdateType.INIT:
        this._tripInfoComponent.points = updatedData;
        render(this._container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  _handleFiltersModelEvent(updateType, updatedData) {
    switch (updateType) {
      default:
        this._controlsComponent.updateData({filterSelected: updatedData});
    }
  }

  _changeFilterHandler(newFilter) {
    if (newFilter !== this._filtersModel.selected) {
      this._filtersModel.selected = {updateType: UpdateType.MAJOR, updatedData: newFilter};
    }
  }
}
