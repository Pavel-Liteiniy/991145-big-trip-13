import Abstract from "../view/abstract.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (containerElement, childElement, position = `beforeend`) => {
  containerElement = containerElement instanceof Abstract ? containerElement.getElement() : containerElement;
  childElement = childElement instanceof Abstract ? childElement.getElement() : childElement;

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      containerElement.prepend(childElement);
      break;
    case RenderPosition.BEFOREEND:
      containerElement.append(childElement);
      break;
  }
};

export const renderTemplate = (containerElement, template, position = `beforeend`) => {
  containerElement = containerElement instanceof Abstract ? containerElement.getElement() : containerElement;
  containerElement.insertAdjacentHTML(position, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild || ``;
};

export const replace = (newChildElement, oldChildElement) => {
  if (oldChildElement instanceof Abstract) {
    oldChildElement = oldChildElement.getElement();
  }

  if (newChildElement instanceof Abstract) {
    newChildElement = newChildElement.getElement();
  }

  const parentElement = oldChildElement.parentElement;

  if (parentElement === null || oldChildElement === null || newChildElement === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parentElement.replaceChild(newChildElement, oldChildElement);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }
  component.getElement().remove();
  component.removeElement();
};
