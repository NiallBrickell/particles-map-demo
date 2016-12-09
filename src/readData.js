import { add } from 'particles-on-map';
import moment from 'moment';
import parse from 'csv-parse/lib/sync';
import csvData from '!raw!./data.csv'; // eslint-disable-line

let startTime;

let dataLeft;
let orderedData;
const msRepresentingADay = 1000;
function addData() {
  const updateTime = Date.now();
  if (!startTime) {
    startTime = updateTime;
    return;
  }

  const relativeTime = updateTime - startTime;
  const scaledMsValue = 86400000 / msRepresentingADay;
  const scaledTime = relativeTime * scaledMsValue;

  const dataLeftLength = dataLeft.length;
  const dataToAdd = [];
  for (let x = 0; x < dataLeftLength; x++) {
    const journey = dataLeft[x];

    if (journey.relativeStartTime < scaledTime) dataToAdd.push(journey);
    else break;
  }

  // Add data!
  const dataToAddLength = dataToAdd.length;

  for (let x = 0; x < dataToAddLength; x++) {
    const journey = dataToAdd[x];
    const delta = journey.endTime - journey.startTime;
    const daysTaken = delta / 86400000;
    const msToTake = daysTaken * msRepresentingADay;

    add({
      orig: journey.orig,
      dest: journey.dest,
      msToTake,
    });
  }

  dataLeft = dataLeft.slice(dataToAddLength, dataLeft.length);

  // if (dataLeft.length === 0) dataLeft = orderedData; // Loop data
}

export default function readData() {
  const data = parse(csvData);

  let firstJourneyStartTime;
  orderedData = data
    .slice(0, 100)
    .filter((j, index) => index !== 0)
    .map((journey) => {
      // Parse data
      const startTime = new moment(journey[1], 'DD/MM/YYYY').valueOf();
      const endTime = new moment(journey[7], 'DD/MM/YYYY').valueOf();
      const orig = [parseFloat(journey[5]), parseFloat(journey[6])];
      const dest = [parseFloat(journey[11]), parseFloat(journey[12])];

      return {
        ...journey,
        startTime,
        endTime,
        orig,
        dest,
      };
    })
    .sort((a, b) => a.startTime - b.startTime)
    .map((journey, index) => {
      // Calculate relative start times
      if (index === 0) {
        firstJourneyStartTime = journey.startTime;
        return {
          ...journey,
          relativeStartTime: 0,
        }
      }

      return {
        ...journey,
        relativeStartTime: (journey.startTime - firstJourneyStartTime),
      };
    });
  dataLeft = orderedData;

  const updateTime = 50;
  setInterval(addData, updateTime);
}
