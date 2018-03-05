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
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';

import { getSetting } from '../../_modules/savedSettings/savedSettings';
import type { SettingsType, QuestionType } from '../../utils/types';
import { activeQuestionStart } from '../../_global/activeQuestion/activeQuestionActions';

import QuestionDetails from '../QuestionDetails';
import * as QuestionDisplayActions from './questionDisplayActions';
import { InlineIcon, Space, Dialog } from '../../utils/components';
import { isInteger, isNaturalNumber } from '../../utils/helperFuncs';


const actions = { ...QuestionDisplayActions, startActiveQuestion: activeQuestionStart };


type Props = {
  settings: ?SettingsType,
  question: ?QuestionType,
  prize: string,
  duration: string,
  multipleWinners: boolean,
  endEarly: boolean,
  busy: boolean,
  changePrize: string => any,
  changeDuration: string => any,
  changeMultipleWinners: boolean => any,
  changeEndEarly: boolean => any,
  deleteQuestion: number => any,
  openDeleteDialog: () => any,
  closeDeleteDialog: () => any,
  deleteDialogOpen: boolean,
  startActiveQuestion: (QuestionType, number, number, boolean, boolean) => any
};


const QuestionDisplay = ({
  settings, question, prize, duration, multipleWinners, endEarly, busy,
  changePrize, changeDuration, changeMultipleWinners, changeEndEarly,
  deleteQuestion, openDeleteDialog, closeDeleteDialog, deleteDialogOpen,
  startActiveQuestion
}: Props) => {
  if (settings === undefined || settings === null) {
    return (
      <div>
        <Typography type="title" style={{ marginBottom: '10px' }}>Settings loading...</Typography>
      </div>
    );
  }

  const callWithInputValue = handler => e => handler(e.target.value);
  const onPrizeChange = callWithInputValue(changePrize);
  const onDurationChange = callWithInputValue(changeDuration);
  const onDeleteDialogClose = confirm => () => {
    if (question !== undefined && question !== null) {
      if (confirm) deleteQuestion(question.questionID);
      closeDeleteDialog();
    }
  };

  const defaultDuration = getSetting(settings, 'misc', 'defaultDuration');
  if (defaultDuration === null || defaultDuration === undefined) {
    throw Error('defaultDuration does not exist!');
  }

  const defaultPrize = getSetting(settings, 'misc', 'defaultPrize');
  if (defaultPrize === null || defaultPrize === undefined) {
    throw Error('defaultPrize does not exist!');
  }

  const startQuestion = () => {
    if (question !== undefined && question !== null) {
      startActiveQuestion(
        question,
        parseInt(duration === '' ? defaultDuration : duration, 10),
        parseInt(prize === '' ? defaultPrize : prize, 10),
        !multipleWinners && endEarly,
        multipleWinners
      );
    }
  };

  const startButtonDisabled =
    busy || question === null || !isInteger(prize) || !isNaturalNumber(duration);

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
            placeholder={defaultPrize}
            InputProps={{ endAdornment: (
              <InputAdornment position="end">
                {getSetting(settings, 'misc', `point${Math.abs(parseInt(prize, 10)) === 1 ? '' : 's'}Name`)}
              </InputAdornment>
            ) }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Duration"
            type="number"
            value={duration}
            onChange={onDurationChange}
            placeholder={defaultDuration}
            InputProps={{ endAdornment: (
              <InputAdornment position="end">
                {`second${duration === 1 ? '' : 's'}`}
              </InputAdornment>
            ) }}
          />
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item xs={12} sm={6} style={{ textAlign: 'center' }}>
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
        <Grid item xs={12} sm={6} style={{ textAlign: 'center' }}>
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

      <br />
      <Divider />
      <br />

      <div style={{ width: '100%', textAlign: 'center' }}>
        {
          question === null || question === undefined ?
            <Typography><i>No question selected.</i></Typography> :
            <QuestionDetails
              question={question}
              onDeleteButton={openDeleteDialog}
              deleteButtonEnabled={!busy}
            />
        }
      </div>
      <br />
      <Divider />
      <br />
      <Button raised color="primary" style={{ width: '100%' }} disabled={startButtonDisabled} onClick={startQuestion}>
        Go!
        <Space>1</Space>
        <InlineIcon>arrow-right-thick</InlineIcon>
      </Button>

      <Dialog
        title="Delete question?"
        content={
          <span>
            This action cannot be undone.
            <br />
            Do you wish to continue?
          </span>
        }
        open={deleteDialogOpen}
        handleClose={onDeleteDialogClose}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  settings: state.global.settings,
  ...state.questionDisplay
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);


// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(QuestionDisplay);
