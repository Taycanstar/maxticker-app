// elapsedTimeUtils.js

export const calculateElapsedTime = (startTime: any) => {
  const now = performance.now();
  return now - startTime;
};
