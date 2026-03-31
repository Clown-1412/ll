import 'react-native';
import React from 'react';
import App from '../App';
import { act } from 'react-test-renderer';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  act(() => {
    renderer.create(<App />);
  });
});
