import {
  logger,
  consoleTransport,
  fileAsyncTransport,
} from 'react-native-logs';
import RNFS from 'react-native-fs';
import moment from 'moment';

const date = moment().format('YYYY-MM-DD');

const config = {
  severity: __DEV__ ? 'debug' : 'debug',
  transport: __DEV__ ? consoleTransport : fileAsyncTransport,
  transportOptions: {
    FS: RNFS,
    fileName: `app.log.${date}`,
    filePath: RNFS.ExternalDirectoryPath,
    colors: 'ansi',
  },
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  async: true,
  dateFormat: 'local' as 'time' | 'local' | 'utc' | 'iso',
  printLevel: true,
  printDate: true,
  enabled: true,
};

const _logger = logger.createLogger(config);
_logger.log = _logger.debug;
_logger.info('create Logger', _logger);

export default _logger;
