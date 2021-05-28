// 记录类型
export interface RecordType {
  name: string;
  value: number;
  description?: string;
}

export const PERCENTAGE_RECORD_TYPE: RecordType = {
  name: '百分比',
  value: 1,
  description: '数值从0-100里取值',
};
export const COUNT_RECORD_TYPE: RecordType = {
  name: '计数',
  value: 2,
  description: '数值从0开始增长',
};
export const NUMBER_RECORD_TYPE: RecordType = {
  name: '数值',
  value: 3,
  description: '用户输入的任意合法数值',
};
export const INTERVAL_RECORD_TYPE: RecordType = {
  name: '区间',
  value: 4,
  description: '数值从一点开始到另一点结束',
};
export const RecordeTypes: RecordType[] = [
  PERCENTAGE_RECORD_TYPE,
  COUNT_RECORD_TYPE,
  NUMBER_RECORD_TYPE,
  INTERVAL_RECORD_TYPE,
];

export type EmptyObject = Record<string, never>;
