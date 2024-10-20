import { render } from '@testing-library/react-native';

import HomeScreen from '@/app/(tabs)/index';

describe('<HomeScreen />', () => {
  test('タイトルが表示されていること', () => {
    const { getByText } = render(<HomeScreen />);

    getByText('ステージ1');
  });

  test('タイルが表示されていること', () => {
    const { getByText } = render(<HomeScreen />);

    getByText('1');
    getByText('9');
  });

});