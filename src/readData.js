import { inputData } from 'particles-on-map';
import parse from 'csv-parse/lib/sync';
import csvData from '!raw!./data.csv'; // eslint-disable-line


// TODO: Time in map - use for throttling -> creating new markers
//  so positions are actually accurate (get created based on time).

export default function readData() {
  const data = parse(csvData);
  const headers = {
    startDateCol: null,
    endDateCol: null,
    origLocCols: [],
    destLocCols: [],
  };

  data[0].forEach((header, index) => {
    if (header === 'Sent') headers.startDateCol = index;
    else if (header === 'Received') headers.endDateCol = index;
    else if (header === 'Origin Lat') headers.origLocCols[0] = index;
    else if (header === 'Origin Long') headers.origLocCols[1] = index;
    else if (header === 'Destination Lat') headers.destLocCols[0] = index;
    else if (header === 'Destination Long') headers.destLocCols[1] = index;
  });
  const dataWithoutHeaders = data.filter((j, index) => index !== 0);

  inputData(headers, dataWithoutHeaders);
}
