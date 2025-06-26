
export const STREAM_CONFIG = {
  MAX_RETRIES: 10,
  MAX_NO_DATA_ATTEMPTS: 1800, // 30 minutes (1800 * 1s = 1800s)
  POLL_INTERVALS: {
    DEFAULT: 1000,      // 1 second
    AFTER_1_MIN: 2000,  // 2 seconds after 1 minute
    AFTER_5_MIN: 5000,  // 5 seconds after 5 minutes
    AFTER_15_MIN: 10000 // 10 seconds after 15 minutes
  },
  TIMEOUT_THRESHOLDS: {
    ONE_MINUTE: 60,
    FIVE_MINUTES: 300,
    FIFTEEN_MINUTES: 900
  }
};

export const getPollInterval = (noDataCount: number): number => {
  if (noDataCount > STREAM_CONFIG.TIMEOUT_THRESHOLDS.FIFTEEN_MINUTES) {
    return STREAM_CONFIG.POLL_INTERVALS.AFTER_15_MIN;
  }
  if (noDataCount > STREAM_CONFIG.TIMEOUT_THRESHOLDS.FIVE_MINUTES) {
    return STREAM_CONFIG.POLL_INTERVALS.AFTER_5_MIN;
  }
  if (noDataCount > STREAM_CONFIG.TIMEOUT_THRESHOLDS.ONE_MINUTE) {
    return STREAM_CONFIG.POLL_INTERVALS.AFTER_1_MIN;
  }
  return STREAM_CONFIG.POLL_INTERVALS.DEFAULT;
};
