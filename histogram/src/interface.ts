export interface TextStyle {
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: 'Normal' | 'Italic';
  fontWeight?: 'Normal' | 'Light' | 'Bold' | 'Bolder';
  color?: string;
}

export interface G2TextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: 'normal' | 'lighter' | 'bold' | 'bolder';
  fill?: string;
}

export interface Properties {
  palette?: string[];
  graphOpacity?: number;
  groupingInterval?: number;
  showDataLabel?: boolean;
  dataLabelPosition?: 'top' | 'middle';
  dataLabelFrequency?: boolean;
  dataLabelGrouping?: boolean;
  dataLabelSeries?: boolean;
  dataLabelTextStyle?: TextStyle;
  showLegend?: boolean;
  legendTitle?: boolean;
  legendTextStyle?: TextStyle;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  legendWrap?: boolean;
  showGroupingAxis?: boolean;
  groupingAxisLine?: boolean;
  groupingAxisTickLabel?: boolean;
  groupingAxisTickMark?: boolean;
  groupingAxisTitle?: boolean;
  groupingAxisFormat?: string;
  groupingAxisLabelAutoRotate?: boolean;
  groupingAxisTextStyle?: TextStyle;
  showFrequencyAxis?: boolean;
  frequencyAxisGridline?: boolean;
  frequencyAxisGridlineColor?: string;
  frequencyAxisMaxValue?: number;
  frequencyAxisMinValue?: number;
  frequencyAxisInterval?: number;
  frequencyAxisLine?: boolean;
  frequencyAxisTickLabel?: boolean;
  frequencyAxisTickMark?: boolean;
  frequencyAxisTitle?: boolean;
  frequencyAxisLabelAutoRotate?: boolean;
  frequencyAxisTextStyle?: TextStyle;
}
