// 记录类型
export interface RecordType {
  name: string;
  value: number;
  description?: string;
}

export const RATING_RECORD_TYPE: RecordType = {
  name: 'Rating',
  value: 1,
  description: '数值从0-1里取值',
};
export const COUNTING_RECORD_TYPE: RecordType = {
  name: 'Counting',
  value: 2,
  description: '数值从0开始增长',
};
export const INPUTTING_RECORD_TYPE: RecordType = {
  name: 'Inputting',
  value: 3,
  description: '用户输入的任意合法数值',
};
export const Timing_RECORD_TYPE: RecordType = {
  name: 'Timing',
  value: 4,
  description: '数值从一点开始到另一点结束',
};
export const BOOLEAN_RECORD_TYPE: RecordType = {
  name: 'Boolean',
  value: 5,
  description: '数值在0和1之间取值',
};

export const RecordeTypes: RecordType[] = [
  RATING_RECORD_TYPE,
  COUNTING_RECORD_TYPE,
  INPUTTING_RECORD_TYPE,
  Timing_RECORD_TYPE,
  BOOLEAN_RECORD_TYPE,
];

export type EmptyObject = Record<string, never>;
