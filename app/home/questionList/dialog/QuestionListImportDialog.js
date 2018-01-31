// @flow
import React from 'react';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';

import { Dialog } from '../../../utils/components';


const QuestionListImportDialog = ({
  open, handleClose,
  amount, onAmountChange,
  difficulty, onDifficultyChange
}) => (
    <Dialog
      title="Import questions"
      error={(+amount) > 50}
      helperText={(+amount) > 50 ? 'Must be 50 or less!' : ''}
      content={(
        <span>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={onAmountChange}
          />

          <br /><br />

          <TextField
            fullWidth
            select
            label="Difficulty"
            value={difficulty}
            onChange={onDifficultyChange}
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </TextField>
        </span>
      )}
      open={open}
      handleClose={handleClose}
      confirmEnabled={difficulty !== '' && amount !== ''}
      confirmText="Import"
      cancelText="Cancel"
    />
  );

export default QuestionListImportDialog;
