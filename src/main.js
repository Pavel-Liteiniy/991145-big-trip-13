import {UpdateType} from "./const.js";

import Api from "./api/api.js";

import FiltersModel from "./model/filters.js";
import PointsModel from "./model/points.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";

import ControlsPresenter from "./presenter/controls.js";
import EventsListPresenter from "./presenter/events-list.js";

const AUTHORIZATION = `Basic b1xzmf1k0zj8v7jvzi59`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip/`;

const headerElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const filtersModel = new FiltersModel();
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const controlsPresenter = new ControlsPresenter(headerElement, pointsModel, filtersModel);
const eventsListPresenter = new EventsListPresenter(tripEventsElement, pointsModel, offersModel, destinationsModel, filtersModel, api);

api.getPoints()
  .then((points) => {
    pointsModel.collection = {updateType: UpdateType.INIT, updatedData: points};
  })
  .catch(() => {
    pointsModel.collection = {updateType: UpdateType.INIT, updatedData: []};
  });

api.getOffers()
  .then((offers) => {
    offersModel.collection = {updateType: UpdateType.INIT, updatedData: offers};
  })
  .catch(() => {
    offersModel.collection = {updateType: UpdateType.INIT, updatedData: []};
  });

api.getDestinations()
  .then((destinations) => {
    destinationsModel.collection = {updateType: UpdateType.INIT, updatedData: destinations};
  })
  .catch(() => {
    destinationsModel.collection = {updateType: UpdateType.INIT, updatedData: []};
  });

controlsPresenter.init();
eventsListPresenter.init();
