// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';

import { Space, InlineIcon } from '../../utils/components';
import * as activeQuestionActions from '../../_global/activeQuestion/activeQuestionActions';

import QuestionDetails from '../QuestionDetails';


const ActiveQuestionDisplay = ({
  question, timeLeft, running, activeQuestionReset, activeQuestionEnd, endEarly, multipleWinners
}) => {
  const secs = timeLeft % 60;
  const mins = Math.floor(timeLeft/60) % 60;
  const hrs = Math.floor(timeLeft/3600);

  const secsPrinted = `${secs<10 ? '0' : ''}${secs}`;
  const minsPrinted = `${mins<10 ? '0' : ''}${mins}:`;
  const hrsPrinted = hrs > 0 ? `${hrs<10 ? '0' : ''}${hrs}:` : '';

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography type="headline">
        {hrsPrinted}{minsPrinted}{secsPrinted}
      </Typography>

      <br/>
      <Divider/>
      <br/>

      <QuestionDetails question={question} deleteButtonHidden />

      <br/>
      <br/>

      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography type="body2">Allow multiple winners</Typography>
          <InlineIcon color="black">{`checkbox-${multipleWinners ? 'marked' : 'blank'}-circle-outline`}</InlineIcon>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography type="body2">Finish on first correct answer</Typography>
          <InlineIcon color="black">{`checkbox-${endEarly ? 'marked' : 'blank'}-circle-outline`}</InlineIcon>
        </Grid>
      </Grid>

      <br/>
      <Divider/>
      <br/>

      {
        running ? [
          <Button
            raised
            color="accent"
            key="cancelButton"
            onClick={() => activeQuestionEnd(true)}
          >
            Cancel question
          </Button>,

          <Space key="space">4</Space>,

          <Button
            raised
            color="primary"
            key="finishNowButton"
            onClick={() => activeQuestionEnd(false)}
          >
            Finish now
          </Button>
        ] :
          <Button
            raised
            color="primary"
            onClick={activeQuestionReset}
          >
            Done
          </Button>
      }
    </div>
  );
};


const mapStateToProps = state => ({
  ...state.global.activeQuestion
});

const mapDispatchToProps = dispatch => bindActionCreators(activeQuestionActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActiveQuestionDisplay);
