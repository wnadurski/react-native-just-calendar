import { Calendar } from './index';
import { render } from '@testing-library/react-native';

it('works', () => {
  const { getAllByTestId } = render(<Calendar />);
  expect(getAllByTestId('Calendar-FlatList')).toBe(2);
});
