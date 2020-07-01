import React from 'react';
import ButtonGroup from './ButtonGroup';
import Button from '@components/base/Button/Button';
import { withKnobs, text, radios, boolean } from '@storybook/addon-knobs';

// Button;

export default {
  title: 'components/base/ButtonGroup',
  component: ButtonGroup,
  decorators: [withKnobs],
};

export const buttonGroup = () => {
  const direction = radios(
    'direction',
    { Row: 'row', Column: 'column' },
    'row',
  );
  const rightAlign = boolean('rightAlign', false);
  const gap = text('gap', '0.5rem');

  return pug`
    ButtonGroup(direction=direction rightAlign=rightAlign gap=gap)
      Button(theme='tertiary') 취소
      Button 확인
  `;
};

buttonGroup.story = {
  name: 'Default',
};

export const rightAlign = () => {
  return pug`
    ButtonGroup(rightAlign)
      Button(theme='tertiary') 취소
      Button 확인
  `;
};

export const column = () => {
  return pug`
    ButtonGroup(direction='column')
      Button CLICK ME
      Button CLICK ME
  `;
};

export const customGap = () => {
  return pug`
    ButtonGroup(gap='1rem')
      Button(theme='tertiary') 취소
      Button 확인
  `;
};

export const customGapColumn = () => {
  return pug`
    ButtonGroup(direction='column' gap='1rem')
      Button CLICK ME
      Button CLICK ME
  `;
};
