/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the follower div', () => {
    render(<App />);
    const follower = document.querySelector('div');
    expect(follower).toBeInTheDocument();
  });

  it('initializes with position (0, 0)', () => {
    render(<App />);
    const follower = document.querySelector('div');
    expect(follower).toHaveStyle('transform: translate(0px, 0px)');
  });

  it('updates position on pointermove event', () => {
    render(<App />);
    const follower = document.querySelector('div');

    // Simulate a pointer move event
    fireEvent.pointerMove(window, { clientX: 100, clientY: 200 });

    // Check if the style was updated
    expect(follower).toHaveStyle('transform: translate(100px, 200px)');
  });

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<App />);
    
    unmount();
    
    // Check if removeEventListener was called for 'pointermove'
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'pointermove',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});
