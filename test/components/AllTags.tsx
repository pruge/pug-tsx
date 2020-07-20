import React, { useState } from 'react';
import { useTags, useCards } from '@lib/contexts';
import {
  useToggleTagMutation,
  useDeleteTagMutation,
  TagsDocument,
  Card,
  CardDocument,
} from '@graphql';
import { joinTags } from '@lib/scripts';
import { addmoveListCache, addmoveSubListCache } from '@lib/apollo';

import { makeStyles } from '@material-ui/core/styles';

import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import Tags from '@components/base/Tags';

interface Props {
  card: Card;
}
function AllTags({ card }: Props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const { grouped, setCopied, canRemoveTag, query } = useTags();
  const { cardId } = useCards();
  const groups = Object.keys(grouped);
  const [deleteTag] = useDeleteTagMutation();
  const [toggleTag] = useToggleTagMutation();
  const cardHasTags = card && card.tags ? card.tags.map((t) => t.tagId) : [];

  // console.log('card', card, cardHasTags);

  console.log('groups', grouped);

  const isAttachTag = (tagId: number) => {
    // console.log(cardHasTags.indexOf(tagId) !== -1);

    return cardHasTags.indexOf(tagId) !== -1;
  };

  const handleClick = (tagId: number) => async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardId) {
      // tag navigation
      const rect = e.currentTarget.getBoundingClientRect();
      const xClick2 = e.clientX - rect.left;
      const yClick2 = e.clientY - rect.top;
      console.log(`x2: ${xClick2}`);
      console.log(`y2: ${yClick2}`);
      return;
    }

    // console.log(`apply tag `, tagId);
    const connect = !isAttachTag(tagId);
    await toggleTag({
      variables: { tagId, cardId, connect },
      update: (store, { data }) => {
        if (!data) {
          return null;
        }

        addmoveSubListCache({
          store,
          query: CardDocument,
          variables: { cardId },
          key: 'card',
          subKey: 'tags',
          id: tagId,
          keyId: 'tagId',
          data: connect ? { tagId, __typename: 'Tag' } : null,
        });
      },
    });
  };

  const handleCopyClick = (tag: any) => (event: React.MouseEvent) => {
    event.stopPropagation();
    const tags = joinTags(tag);
    setCopied(tags);
  };

  const handleDeleteClick = (tagId: number) => async (
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();

    await deleteTag({
      variables: { tagId },
      update: (store, { data }) => {
        if (!data) {
          return null;
        }

        addmoveListCache({
          store,
          query: TagsDocument,
          variables: null,
          key: 'tags',
          id: tagId,
          keyId: 'tagId',
          data: null,
        });
      },
    });
  };

  return pug`
    div
      Collapse(in=open)
        Alert(
          action=${pug`
            IconButton(
              aria-label='close'
              color='inherit'
              size='small'
              onClick=() => setOpen(false)
            )
              CloseIcon(fontSize='inherit')
          `}
        )
          | Close me!
      each group in groups
        div(key=group)
          Divider(className=classes.divider)
          Typography(variant='h4' component='h5' className=classes.header) #{group}
          each tag in grouped[group]
            Tags(
              key=tag.tagId
              tag=tag
              checked=isAttachTag(tag.tagId)
              onSelectClick=handleClick(tag.tagId)
              onCopyClick=handleCopyClick(tag)
              onDeleteClick=handleDeleteClick(tag.tagId)
            )
  `;
}

export default AllTags;

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(2, 0, 2, 0),
  },
  divider: {
    marginTop: theme.spacing(1),
  },
}));
