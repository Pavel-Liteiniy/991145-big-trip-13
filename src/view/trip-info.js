import dayjs from 'dayjs';
import SmartView from "./smart";

const getTitle = (points) => {
  let locations = new Set();
  points.forEach((point) => {
    return locations.add(point.destination.name);
  });

  locations = Array.from(locations);

  if (locations.length < 4) {
    return locations.join(` — `);
  }

  return `${locations[0]} —...— ${locations[locations.length - 1]}`;
};

const getCost = (points) => {
  return points.reduce((previousPoint, currentPoint) => {
    const offerCostTotal = currentPoint.offers.reduce((previousOffer, currentOffer) => {
      return {price: previousOffer.price + currentOffer.price};
    }, {price: 0});

    return {basePrice: previousPoint.basePrice + currentPoint.basePrice + offerCostTotal.price};
  }, {basePrice: 0}).basePrice;
};

const getDates = (points) => {
  return `${dayjs(points[0].dateFrom).format(`MMM D`)}&nbsp;—&nbsp;${dayjs(points[points.length - 1].dateTo).format(`MMM D`)}`;
};

const createTripInfo = (points) => {
  const sortedPoints = points.sort((a, b) => {
    return dayjs(a.dateFrom).diff(dayjs(b.dateFrom));
  });

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${getTitle(sortedPoints)}</h1>

              <p class="trip-info__dates">${getDates(sortedPoints)}</p>
            </div>

            <p class="trip-info__cost">
              Total: €&nbsp;<span class="trip-info__cost-value">${getCost(points)}</span>
            </p>
          </section>`;
};

export default class TripInfo extends SmartView {
  constructor() {
    super();
  }

  set points(points) {
    this._data = points;
  }

  getTemplate() {
    return createTripInfo(this._data);
  }
}
