import React from 'react';
import { css, jsx } from '@emotion/core';
import ButtonGroup from '@components/ButtonGroup';
import Button from '@components/Button';
import { useTransition, animated } from 'react-spring';

export type DialogProps = {
  visible: boolean;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  hideButtons?: boolean;
  cancellable?: boolean;
  cancelText: string;
  confirmText: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

const Dialog = ({
  visible,
  title,
  description,
  children,
  hideButtons,
  cancellable,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}: DialogProps) => {
  const fadeTransition = useTransition(visible, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const slideUpTransition = useTransition(visible, null, {
    from: {
      transform: `translateY(200px) scale(0.8)`,
      opacity: 0,
    },
    enter: {
      transform: `translateY(0px) scale(1)`,
      opacity: 1,
    },
    leave: {
      transform: `translateY(200px) scale(0.8)`,
      opacity: 0,
    },
    config: {
      tension: 200,
      friction: 15,
    },
  });

  const AnimatedDiv = animated.div;

  return pug`
    React.Fragment
      ${fadeTransition.map(({ item, key, props }) => {
        return pug`
          if item
            AnimatedDiv(
              css=[fullscreen, darkLayer]
              key=key
              style=props
            )
        `;
      })}
      ${slideUpTransition.map(({ item, key, props }) => {
        return pug`
          if item
            AnimatedDiv(
              css=[fullscreen, whiteBoxWrapper]
              style=props
              key=key
            )
              div(css=whiteBox)
                if title
                  h3 #{title}
                if description
                  p #{description}
                = children
                if !hideButtons
                  ButtonGroup(css={ marginTop: '3rem' } rightAlign)
                    if cancellable
                      Button(theme='tertiary' onClick=onCancel) #{cancelText}
                    Button(onClick=onConfirm) #{confirmText}

        `;
      })}
  `;
};

Dialog.defaultProps = {
  cancelText: '취소',
  confirmText: '확인',
};

const fullscreen = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const darkLayer = css`
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
`;

const whiteBoxWrapper = css`
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const whiteBox = css`
  box-sizing: border-box;
  border-radius: 4px;
  width: 25rem;
  background: white;
  box-shadow: 0px 4px 8px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;

  h3 {
    font-size: 1.5rem;
    color: #343a40;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.125rem;
    margin: 0;
    color: #868e96;
  }
`;

export default Dialog;
