import counter from '../../app/counter/counterReducer';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../../app/counter/counterActions';

describe('reducers', () => {
  describe('counter', () => {
    it('should handle initial state', () => {
      expect(counter(undefined, {})).toMatchSnapshot();
    });

    it('should handle INCREMENT_COUNTER', () => {
      expect(counter(1, { type: INCREMENT_COUNTER })).toMatchSnapshot();
    });

    it('should handle DECREMENT_COUNTER', () => {
      expect(counter(1, { type: DECREMENT_COUNTER })).toMatchSnapshot();
    });

    it('should handle unknown action type', () => {
      expect(counter(1, { type: 'unknown' })).toMatchSnapshot();
    });
  });
});