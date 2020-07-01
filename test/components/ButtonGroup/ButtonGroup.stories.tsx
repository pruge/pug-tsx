import React from 'react';
import Button from '@components/Button';
import ButtonGroup from '@components/ButtonGroup';
import { withKnobs, text, radios, boolean } from '@storybook/addon-knobs';

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

// export const customGapColumn2 = () => {
//   return (
//     <ButtonGroup direction="column" gap="1rem">
//       <Button>CLICK ME</Button>
//       <Button>CLICK ME</Button>
//     </ButtonGroup>
//   );
// };
