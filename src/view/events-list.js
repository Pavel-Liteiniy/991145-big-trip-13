import AbstractView from "./abstract";

const createEventList = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class EventList extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createEventList();
  }
}
