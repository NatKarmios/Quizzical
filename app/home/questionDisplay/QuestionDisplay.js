// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import { InputAdornment } from 'material-ui/Input';

import { getSetting } from '../../_modules/savedSettings';

import QuestionDetails from './QuestionDisplayQuestionDetails';
import * as QuestionDisplayActions from './questionDisplayActions';


const QuestionDisplay = ({
  settings, question, prize, duration, multipleWinners, endEarly,
  changeQuestion, changePrize, changeDuration, changeMultipleWinners, changeEndEarly
}) => {
  const callWithInputValue = handler => e => handler(e.target.value);
  const onPrizeChange = callWithInputValue(changePrize);
  const onDurationChange = callWithInputValue(changeDuration);

  return (
    <div>
      <Typography type="title" style={{ marginBottom: '10px' }}>Start a question:</Typography>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Prize"
            type="number"
            value={prize}
            onChange={onPrizeChange}
            InputProps={{endAdornment: (
              <InputAdornment position="end">
                {getSetting(settings, 'misc', `point${Math.abs(prize) === 1 ? '' : 's'}Name`)}
              </InputAdornment>
            )}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Duration"
            type="number"
            value={duration}
            onChange={onDurationChange}
            InputProps={{endAdornment: (
              <InputAdornment position="end">
                seconds
              </InputAdornment>
            )}}
          />
        </Grid>
      </Grid>
      <br/>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={multipleWinners}
                onChange={(e, checked) => changeMultipleWinners(checked)}
              />
            }
            label="Allow multiple winners"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={!multipleWinners && endEarly}
                onChange={(e, checked) => changeEndEarly(checked)}
              />
            }
            label="Finish on first correct answer"
            disabled={multipleWinners}
          />
        </Grid>
      </Grid>
      <br/><br/>
      <div style={{ width: '100%', textAlign: 'center' }}>
        {
          question === null ?
            <Typography><i>No question selected.</i></Typography> :
            <QuestionDetails question={question}/>
        }
      </div>
    </div>
  )
};

const mapStateToProps = state => ({
  settings: state.global.settings,
  ...state.questionDisplay
});

const mapDispatchToProps = (dispatch) => bindActionCreators(QuestionDisplayActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(QuestionDisplay);
