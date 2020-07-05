import React from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layout';
import fetch from 'isomorphic-unfetch';
import Router from 'next/router';
import { makeStyles } from '@material-ui/styles';
import { PostProps } from '../../components/Post';

const useStyles = makeStyles((theme) => ({
  root: {
    '& button': {
      background: '#ececec',
      border: 0,
      borderRadius: '0.125rem',
      padding: '1rem 2rem',
    },
    '& button + button': {
      marginLeft: '1rem',
    },
  },
}));

async function publish(id: number): Promise<void> {
  const res = await fetch(`http://localhost:3000/api/publish/${id}`, {
    method: 'PUT',
  });
  const data = await res.json();
  await Router.push('/');
}

async function destroy(id: number): Promise<void> {
  const res = await fetch(`http://localhost:3000/api/post/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  Router.push('/');
}

const Post: React.FC<PostProps> = (props) => {
  const classes = useStyles();

  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  const handlePublish = () => {
    publish(props.id);
  };

  const handleDelete = () => {
    destroy(props.id);
  };

  return pug`
    Layout
      div
        h2 #{title}
        p By ${props?.author?.name || 'Unknown author'}
        ReactMarkdown(source=props.content)
        if !props.published
          button(onClick=handlePublish) Publish
        button(onClick=handleDelete) Delete
  `;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(
    `http://localhost:3000/api/post/${context.params.id}`,
  );
  const data = await res.json();
  return { props: { ...data } };
};

export default Post;
