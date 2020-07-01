import Button from '@components/Button';
import { jsx, css } from '@emotion/core';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import ButtonGroup from '@components/ButtonGroup';

export default {
  title: 'components/base/Button',
  component: Button,
  decorators: [withKnobs],
};

export const button = () => {
  const label = text('children', 'BUTTON');
  const size = select('size', ['small', 'medium', 'big'], 'medium');
  const theme = select(
    'theme',
    ['primary', 'secondary', 'tertiary'],
    'primary',
  );
  const disabled = boolean('disabled', false);
  const width = text('width', '');

  return pug`
    Button(
      size=size
      theme=theme
      disabled=disabled
      width=width
      onClick=action('onClick')
    )
      | #{label}
  `;
};

button.story = {
  name: 'Default',
};

export const primaryButton = () => {
  return pug`
    Button PRIMARY
  `;
};

export const secondaryButton = () => {
  return pug`
    Button(theme='secondary') SECONDARY
  `;
};

export const tertiaryButton = () => {
  return pug`
    Button(theme='tertiary') TERTIARY
  `;
};

const buttonWrapper = css`
  .description {
    margin-bottom: 0.5rem;
  }
  & > div + div {
    margin-top: 2rem;
  }
`;

export const sizes = () => {
  return pug`
    div(css=buttonWrapper)
      div
        div(className='description') Small
        Button(size='small') BUTTON
      div
        div(className='description') Medium
        Button(size='medium') BUTTON
      div
        div(className='description') Big
        Button(size='big') BUTTON
  `;
};

export const disabled = () => {
  return pug`
    div(css=buttonWrapper)
      div
        Button(disabled) PRIMARY
      div
        Button(disabled theme='secondary') SECONDARY
      div
        Button(disabled theme='tertiary') TERTIARY
  `;
};

export const customSized = () => {
  return pug`
    div(css=buttonWrapper)
      div
        Button(width='20rem') CUSTOM WIDTH
      div
        Button(width='100%') FULL WIDTH
  `;
};
