import { formatDateStringFromBackendMs, formatTimeFromBackendMs } from "../../util/dateTimeFormatUtil";

describe('dateTimeFormatUtil', () => {
  // 7pm Dec 31 2024 EST
  const backendTimeInMs = 1735689600000;

  describe('formatDateStringFromBackendMs', () => {
    it('formats the time from the backend into a date string', () => {
      const formattedString = formatDateStringFromBackendMs(backendTimeInMs);
      expect(formattedString).toBe('Dec 31 2024');
    });
  })

  describe('formatTimeFromBackendMs', () => {
    it('formats the time from backend to hour minutes', () => {
      const formattedTime = formatTimeFromBackendMs(backendTimeInMs);
      expect(formattedTime).toBe('07:00 PM')
    });
  });
});