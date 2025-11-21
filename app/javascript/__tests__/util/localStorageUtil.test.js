import {
  retrieveLocalStorageData,
  setLocalStorageData,
  removeLocalStorageData
} from '../../util/localStorageUtil';

describe('localStorageUtil', () => {
  const testKey = 'testKey';
  const testValue = { body: 'dream text', tags: ['lucid'] };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('setLocalStorageData', () => {
    it('stores a JSON stringified value in localStorage', () => {
      setLocalStorageData(testKey, testValue);
      expect(localStorage.getItem(testKey)).toBe(JSON.stringify(testValue));
    });

    it('handles errors gracefully', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('Quota exceeded');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      setLocalStorageData(testKey, testValue);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to set local storage key ${testKey}:`,
        expect.any(Error)
      );
    });
  });

  describe('retrieveLocalStorageData', () => {
    it('retrieves and parses a stored JSON value', () => {
      localStorage.setItem(testKey, JSON.stringify(testValue));
      const result = retrieveLocalStorageData(testKey);
      expect(result).toEqual(testValue);
    });

    it('returns empty string if key is not found', () => {
      const result = retrieveLocalStorageData('nonexistentKey');
      expect(result).toBe('');
    });

    it('handles malformed JSON gracefully', () => {
      localStorage.setItem(testKey, 'not-json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = retrieveLocalStorageData(testKey);
      expect(result).toBe('');
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to retrieve local storage key ${testKey}:`,
        expect.any(Error)
      );
    });
  });

  describe('removeLocalStorageData', () => {
    it('removes the specified key from localStorage', () => {
      localStorage.setItem(testKey, 'value');
      removeLocalStorageData(testKey);
      expect(localStorage.getItem(testKey)).toBeNull();
    });

    it('handles errors gracefully', () => {
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementationOnce(() => {
        throw new Error('Blocked');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      removeLocalStorageData(testKey);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to remove local storage key ${testKey}:`,
        expect.any(Error)
      );
    });
  });
});