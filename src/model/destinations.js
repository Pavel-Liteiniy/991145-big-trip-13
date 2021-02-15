import Observer from "../utils/observer.js";

export default class Destinations extends Observer {
  constructor() {
    super();
    this._collection = [];
  }

  get collection() {
    return this._collection.slice();
  }

  set collection({updateType, updatedData}) {
    this._collection = updatedData;
    this._notify(updateType, updatedData);
  }
}
