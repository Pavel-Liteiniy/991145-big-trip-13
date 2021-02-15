import Observer from "../utils/observer.js";
import {FilterType} from "../const.js";


export default class Filters extends Observer {
  constructor() {
    super();
    this._selected = FilterType.EVERYTHING;
  }

  get selected() {
    return this._selected;
  }

  set selected({updateType, updatedData}) {
    this._selected = updatedData;
    this._notify(updateType, updatedData);
  }
}
