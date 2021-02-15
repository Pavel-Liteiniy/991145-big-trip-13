import AbstractView from "./abstract";

const createNoEventsPlug = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class NoEventsPlug extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createNoEventsPlug();
  }
}
