import Observer from "../utils/observer.js";
import {updateItem, deleteItem} from '../utils/common';

export default class Points extends Observer {
  constructor() {
    super();
    this._collection = [];
  }

  get collection() {
    return this._collection.slice();
  }

  set collection({updateType, updatedData}) {
    this._collection = updatedData;
    this._notify(updateType, this._collection.slice());
  }

  updatePoint(updateType, updatedPoint) {
    const index = this._collection.findIndex((point) => point.id === updatedPoint.id);
    this._collection = updateItem(this._collection, updatedPoint, index);
    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, newPoint) {
    this._collection.push(newPoint);

    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, deletedPoint) {
    const index = this._collection.findIndex((point) => point.id === deletedPoint.id);
    this._collection = deleteItem(this._collection, index);
    this._notify(updateType, deletedPoint);
  }

  static adaptPointToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          basePrice: point.base_price,
          dateFrom: point.date_from,
          dateTo: point.date_to,
          isFavorite: point.is_favorite,
        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptPointToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "base_price": point.basePrice,
          "date_from": point.dateFrom,
          "date_to": point.dateTo,
          "is_favorite": point.isFavorite,
        }
    );

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
