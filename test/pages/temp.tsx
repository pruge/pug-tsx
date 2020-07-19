import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useAuth } from '@lib/contexts';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import NoSsr from '@material-ui/core/NoSsr';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/DeleteOutline';
import orange from '@material-ui/core/colors/orange';

import ProgressButton from '@components/base/ProgressButton';

interface Props {
  elevation?: number;
  preserve?: boolean;

  owner: number;

  title: string;
  titlePlacehold: string;

  brief?: string;
  briefPlacehold?: string;

  onSave?: Function;
  onClose?: Function;
  onDelete?: Function;

  loading?: boolean;

  message?: string;
}

function WriteBox({
  elevation = 0,
  preserve = false,

  owner,

  title,
  titlePlacehold,

  brief = undefined,
  briefPlacehold,

  onSave,
  onClose,
  onDelete,

  loading,
  message = '',
}: Props) {
  const classes = useStyles();
  const titleRef = useRef(null);
  const briefRef = useRef(null);

  const { user } = useAuth();

  const [edTitle, setEdTitle] = useState(title);
  const [edBrief, setEdBrief] = useState(brief);
  const [isFocussed, setFocussed] = useState(false);
  const [color, setColor] = useState('default');

  const theme = useTheme();

  useEffect(() => {
    setEdTitle(title);
    setEdBrief(brief);
  }, [title, brief]);

  const handleClose = () => {
    titleRef?.current?.blur();
    briefRef?.current?.blur();

    init();
    onClose && onClose();
    setFocussed(false);
  };

  const handleSave = async () => {
    const resp = await onSave({ title: edTitle, brief: edBrief });
    if (resp === false) {
      return;
    }
    setFocussed(false);
    if (!preserve) {
      init();
    }
  };

  const init = () => {
    setEdTitle(title);
    setEdBrief(brief);
  };

  return pug`
    NoSsr
      Card(
        elevation=isFocussed ? 2 : elevation
        classes={ root: classes.paperWrapper }
        style={ background: theme.custom.palette.tag[color] }
      )
        Collapse(
          classes={ wrapperInner: classes.wrapper }
          in=isFocussed
          collapsedHeight='2.7rem'
        )
          InputBase(
            placeholder=isFocussed || brief === undefined ? titlePlacehold : briefPlacehold
            classes={
              root: classes.inputTitleRoot,
              input: classes.inputTitleInput
            }
            disabled=${owner !== user?.userId}
            inputProps={ 'aria-label': titlePlacehold }
            value=edTitle
            inputRef=titleRef
            onFocus=() => setFocussed(true)
            onChange=(event) => setEdTitle(event.target.value)
          )
          if isFocussed && brief !== undefined
            div
              InputBase(
                placeholder=briefPlacehold
                classes={
                  root: classes.inputBriefRoot,
                  input: classes.inputBriefInput
                }
                inputProps={ 'aria-label': briefPlacehold}
                value=edBrief
                inputRef=briefRef
                onChange=(event) => setEdBrief(event.target.value)
                fullWidth
                multiline
              )
          if isFocussed
            CardActions(className=classes.actions)
              Typography(className=classes.message) #{message}
              Button(onClick=handleClose) Cancel
              ProgressButton(
                variant='contained'
                color='secondary'
                onClick=handleSave
                loading=loading
              ) Save (s)

          if onDelete
            IconButton(className=classes.delete onClick=onDelete)
              DeleteIcon
  `;
}

export default WriteBox;

const useStyles = makeStyles((theme) => ({
  paperWrapper: {
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.complex,
    }),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    marginRight: theme.spacing(0.5),
    position: 'relative',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',

    '&:hover > $delete': {
      opacity: 1,
    },
  },

  inputTitleRoot: {
    ...theme.custom.fontFamily.metropolis,
    padding: theme.spacing(1.25, 2),
  },
  inputTitleInput: {
    fontWeight: 500,
    fontSize: '1rem',
    padding: 0,
    lineHeight: '1rem',
    verticalAlign: 'middle',
    color: theme.palette.text.primary,
  },

  inputBriefRoot: {
    ...theme.custom.fontFamily.roboto,
    padding: theme.spacing(0.5, 2, 1.5, 2),
  },
  inputBriefInput: {
    fontWeight: 400,
    fontSize: '0.88rem',
    minHeight: theme.spacing(10),
    padding: 0,
    color: theme.palette.text.primary,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  delete: {
    opacity: 0,
    position: 'absolute',
    top: -1,
    right: 1,
  },
  message: {
    flex: 1,
    color: orange[900],
    paddingLeft: theme.spacing(1),
  },
}));
