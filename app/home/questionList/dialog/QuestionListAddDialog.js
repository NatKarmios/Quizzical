// @flow
import React from 'react';
import TextField from 'material-ui/TextField';
import { InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';

import { MDIcon, Dialog, ListedChip } from '../../../utils/components';


type Props = {
  open: boolean,
  question: string,
  answer: string,
  incorrectAnswers: Array<string>,
  tempIncorrectAnswer: string,
  onQuestionChange: SyntheticInputEvent<> => any,
  onAnswerChange: SyntheticInputEvent<> => any,
  onIncorrectAnswerDelete: number => any,
  onIncorrectAnswerAdd: () => any,
  onTempIncorrectAnswerChange: SyntheticInputEvent<> => any,
  handleClose: () => any
};


const QuestionListAddDialog = ({
  open, question, answer, incorrectAnswers, tempIncorrectAnswer,
  onQuestionChange, onAnswerChange, onIncorrectAnswerDelete,
  onIncorrectAnswerAdd, onTempIncorrectAnswerChange,
  handleClose
}: Props) => {
  const confirmEnabled =
    incorrectAnswers.length > 0 &&
    question !== '' &&
    answer !== '';

  const tempIncorrectAnswerInvalid =
    incorrectAnswers.includes(tempIncorrectAnswer) ||
    (answer === tempIncorrectAnswer && answer !== '') ||
    tempIncorrectAnswer.includes('|');

  let helperText = '';
  if (tempIncorrectAnswerInvalid) {
    // noinspection JSUnusedAssignment
    helperText = tempIncorrectAnswer.includes('|') ?
      helperText += 'Cannot contain \'|\'!' :
      helperText += 'Must be unique!';
  }

  return (
    <Dialog
      title="Add a question"
      content={(
        <span>
          <TextField
            fullWidth
            label="Question"
            value={question}
            onChange={onQuestionChange}
          />

          <br /><br />

          <TextField
            fullWidth
            label="Correct Answer"
            value={answer}
            onChange={onAnswerChange}
          />

          <div style={{ display: 'flex', margin: '10px 0', flexWrap: 'wrap' }}>
            {
              incorrectAnswers.map((incorrectAnswer, i) => (
                <ListedChip
                  key={`incorrectAnswer_${incorrectAnswer}`}
                  onDelete={onIncorrectAnswerDelete(i)}
                >
                  {incorrectAnswer}
                </ListedChip>
              ))
            }
          </div>

          <TextField
            fullWidth
            label="Add answer"
            helperText={helperText}
            value={tempIncorrectAnswer}
            onChange={onTempIncorrectAnswerChange}
            error={tempIncorrectAnswerInvalid}
            InputProps={{ endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={onIncorrectAnswerAdd}
                  disabled={
                    tempIncorrectAnswerInvalid ||
                    tempIncorrectAnswer.length === 0
                  }
                >
                  <MDIcon>plus</MDIcon>
                </IconButton>
              </InputAdornment>
            ) }}
          />
        </span>
      )}
      open={open}
      handleClose={handleClose}
      confirmEnabled={confirmEnabled}
      confirmText="Add"
      cancelText="Cancel"
    />
  );
};


export default QuestionListAddDialog;
