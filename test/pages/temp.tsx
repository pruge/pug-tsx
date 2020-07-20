import React from 'react';
import clsx from 'clsx';
import { useCards } from '@lib/contexts';

import { makeStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import MailIcon from '@material-ui/icons/Mail';
import OneIcon from '@material-ui/icons/LooksOneOutlined';
import TwoIcon from '@material-ui/icons/LooksTwoOutlined';
import FullIcon from '@material-ui/icons/Brightness1';
import SomeIcon from '@material-ui/icons/Brightness3';

import ToggleIconButton from '@components/base/ToggleIconButton';

interface Props {}
function CardToolbar(props: Props) {
  const classes = useStyles();

  const { cardScrolling, setColumn, column } = useCards();

  function getColor(num: number) {
    return num === column ? 'secondary' : 'default';
  }

  return pug`
    div(...props)
      Toolbar(
        disableGutters
        classes={
          root: clsx(classes.toolbarHeight, {[classes.toolbarBorder]: cardScrolling}),
          regular: classes.toolbarHeight
        }
      )
        IconButton(edge='start' onClick=() => setColumn(1) color=getColor(1))
          OneIcon
        IconButton(edge='start' onClick=() => setColumn(2) color=getColor(2))
          TwoIcon

        ToggleIconButton(edge='start' iconA=${pug`SomeIcon`} iconB=${pug`FullIcon`})
  `;
}

export default CardToolbar;

const useStyles = makeStyles((theme) => ({
  toolbarBorder: {
    zIndex: 10,
    boxShadow: '0 0 0 4px white, 0 6px 4px black',
  },
  toolbarHeight: {
    minHeight: theme.spacing(3),
  },
  selected: {
    backgroundColor: theme.palette.secondary.light,
  },
}));
