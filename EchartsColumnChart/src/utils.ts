import _ from 'lodash';

// convert long data to wide data
export type FieldInfo = {
  name: string,
  lookUps: (string | number)[],
}
export const dcast = (
  setting: {
    row?: FieldInfo,
    column: FieldInfo,
    value: FieldInfo,
  },
  source: any[]) => {
  const { row, column, value } = setting;

  const merge = (acc, item) => {
    acc[item[column.name]] = item[value.name];
    return acc;
  };

  if (!row) return [source.reduce(merge, {})];

  const groupedSource = _.groupBy(source, item => item[row.name]);
  return row.lookUps.map(rv => groupedSource[rv].reduce(merge, { [row.name]: rv }))
}