import {NativeModules} from 'react-native';

export const FileSelector: {
  show: (
    config: {
      title: string;
      method: 'read' | 'write';
      multi: boolean;
      filename?: string;
      type?: string;
      dir?: string;
    },
    onDone: (path: string) => void,
    onCancel: () => void,
  ) => void;
} = NativeModules.FileSelector;
