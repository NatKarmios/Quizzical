// @flow
import * as React from 'react';
import type { Node } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';

import { InlineIcon, ListedChip } from '../../utils/components';


const ListWrapper = ({ children }: { children: Node }) => (
  <div style={{ display: 'flex', margin: '10px 0', flexWrap: 'wrap', textAlign: 'center' }}>
    {children}
  </div>
);

const mapAnswerer = answerer => <ListedChip key={answerer}>{answerer}</ListedChip>;


type Props = {
  correctAnswerers: List<string>,
  incorrectAnswerers: List<string>
};


const ActiveQuestionUserList = ({ correctAnswerers, incorrectAnswerers }: Props) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <Typography>
      <InlineIcon padded>check-circle-outline</InlineIcon>
      Correct Answerers
    </Typography>

    {
      [...correctAnswerers].length < 1 ?
        <Typography type="body1"><i>No correct answerers.</i></Typography> :
        <ListWrapper>
          {correctAnswerers.map(mapAnswerer)}
        </ListWrapper>
    }

    <Typography>
      <InlineIcon padded>close-circle-outline</InlineIcon>
      Incorrect Answerers
    </Typography>

    {
      [...incorrectAnswerers].length < 1 ?
        <Typography type="body1"><i>No incorrect answerers.</i></Typography> :
        <ListWrapper>
          {incorrectAnswerers.map(mapAnswerer)}
        </ListWrapper>

    }
  </div>
);


const mapStateToProps = state => ({
  ...state.global.activeQuestion
});


export default connect(mapStateToProps)(ActiveQuestionUserList);
