import React, { useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import Router from 'next/router';

const useStyles = makeStyles((theme) => ({
  page: {
    background: 'white',
    padding: '3rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  root: {
    '& input[type="text"], & textarea': {
      width: '100%',
      padding: '0.5rem',
      margin: '0.5rem 0',
      borderRadius: '0.25rem',
      border: '0.125rem solid rgba(0,0,0,0.2)',
    },

    '& input[type="submit"]': {
      background: '#ececec',
      border: 0,
      padding: '1rem 2rem',
    },
  },
  back: {
    marginLeft: '1rem',
  },
}));

const Draft: React.FC = () => {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, authorEmail };
      const res = await fetch(`http://localhost:3000/api/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      await Router.push('/drafts');
    } catch (error) {
      console.error(error);
    }
  };

  return pug`
    Layout
      div(className=classes.root)
        form(onSubmit=submitData)
          h1 Create Draft
          input(
            autoFocus
            onChange=${(e) => setTitle(e.target.value)}
            placeholder='Title'
            type='text'
            value=title
          )
          input(
            onChange=${(e) => setAuthorEmail(e.target.value)}
            placeholder='Author (email address)'
            type='text'
            value=authorEmail
          )
          textarea(
            cols=50
            onChange=${(e) => setContent(e.target.value)}
            placeholder='Content'
            rows=8
            value=content
          )
          input(
            disabled=(!content || !title || !authorEmail)
            type='submit'
            value='Create'
          )
          a(className=classes.back href='#' onClick=${() => Router.push('/')})
            | or Cancel
  `;
};

export default Draft;
