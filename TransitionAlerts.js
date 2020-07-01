import React, { useState } from 'react';
// material
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}));

export default function TransitionAlerts() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return pug`
    div(className=classes.root)
      Collapse(in=open)
        Alert(
          action=${pug`
            IconButton(
              aria-label='close'
              color='inherit'
              size='small'
              onClick=handleClose
            )
              CloseIcon(fontSize='inherit')
          `}
        )
          | Close me!
      Button(
        disabled=open
        variant='outlined'
        onClick=handleOpen
      )
        | Re-open
  `;
}
