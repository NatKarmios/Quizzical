// @flow

import React from 'react';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import * as setupActions from './setupActions';
import MDIcon from '../utils/components/MDIcon';

type Props = {
  streamerLoginStage: 0 | 1 | 2,
  botLoginStage: 0 | 1 | 2,
  logInStreamer: () => void,
  logInBot: () => void
};

const getLoginButton = (stage: 0 | 1 | 2, onClick) => {
  let content;
  switch (stage) {
    case 0:
      content = 'Log in';
      break;
    case 1:
      content = 'Logging in...';
      break;
    case 2:
      content = 'Done';
      break;
    default:
      break;
  }

  return (
    <Button raised color="primary" disabled={stage > 0} onClick={onClick}>
      {stage === 0 ? <MDIcon style={{ verticalAlign: 'middle', paddingRight: '6px' }}>twitch</MDIcon> : null}
      {content}
    </Button>
  );
};

const Setup = ({ streamerLoginStage, botLoginStage, logInStreamer, logInBot }: Props) => {
  let activeStep: 0 | 1 | 2;
  if (streamerLoginStage === 2) activeStep = botLoginStage === 2 ? 2 : 1;
  else activeStep = 0;

  return activeStep === 2 ? (<Redirect to="/home" />) : (
    <Paper style={{ margin: '20px', padding: '20px' }}>
      <Typography type="headline">
        Lets get set up.
      </Typography>
      <div>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Log into streamer account</StepLabel>
            <StepContent>
              {getLoginButton(streamerLoginStage, logInStreamer)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Log into bot account</StepLabel>
            <StepContent>
              {getLoginButton(botLoginStage, logInBot)}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  streamerLoginStage: state.setup.streamerLoginStage,
  botLoginStage: state.setup.botLoginStage
});

const mapDispatchToProps = (dispatch) => bindActionCreators(setupActions, dispatch);


// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(Setup);
