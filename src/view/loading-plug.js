import AbstractView from "./abstract";

const createLoadingPlug = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

export default class LoadingPlug extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createLoadingPlug();
  }
}
