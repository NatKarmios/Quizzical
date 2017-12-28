// @flow
import React from 'react';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Stepper, Step, StepLabel, StepContent } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';

import * as setupActions from './setupActions';
import MDIcon from "../utils/components/MDIcon";


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
  }

  return (
    <RaisedButton primary disabled={stage > 0} onClick={onClick}>
      {stage === 0 ? <MDIcon color="black" style={{ fontSize: '14px', paddingRight: '6px' }}>twitch</MDIcon> : null}
      {content}
    </RaisedButton>
  );
};

const Setup = ({ streamerLoginStage, botLoginStage, logInStreamer, logInBot }: Props) => {
  let activeStep: 0 | 1 | 2;
  if (streamerLoginStage === 2) activeStep = botLoginStage === 2 ? 2 : 1;
  else activeStep = 0;

  return activeStep === 2 ? (<Redirect to="/home" />) : (
    <div style={{ margin: '20px' }}>
      <Card>
        <CardHeader title="Let's get set up." />
        <CardText>
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
        </CardText>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    streamerLoginStage: state.setup.streamerLoginStage,
    botLoginStage: state.setup.botLoginStage
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(setupActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Setup);
