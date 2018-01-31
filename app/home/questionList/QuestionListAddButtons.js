// @flow
import React from 'react';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';

import { MDIcon, Space, CenteredListItem } from '../../utils/components';

import AddDialog from './dialog/QuestionListAddDialog';
import ImportDialog from './dialog/QuestionListImportDialog';


const IS_NATURAL_NUMBER = RegExp('^\\d*$');

const ADD_DIALOG_DEFAULT_STATE = {
  open: false,
  question: '',
  answer: '',
  incorrectAnswers: [],
  tempIncorrectAnswer: ''
};

const IMPORT_DIALOG_DEFAULT_STATE = {
  open: false,
  amount: '',
  difficulty: ''
};

class QuestionListAddButtons extends React.Component {
  state = {
    addDialog: ADD_DIALOG_DEFAULT_STATE,
    importDialog: IMPORT_DIALOG_DEFAULT_STATE
  };

  render() {
    const { addQuestion=()=>{}, importQuestions=()=>{} } = this.props;
    const { addDialog, importDialog } = this.state;
    const addDialogHandlers = {
      onQuestionChange: e => this.setState({
        addDialog: { ...addDialog, question: e.target.value},
        importDialog
      }),
      onAnswerChange: e => this.setState({
        addDialog: { ...addDialog, answer: e.target.value},
        importDialog
      }),
      onTempIncorrectAnswerChange: e => this.setState({
        addDialog: { ...addDialog, tempIncorrectAnswer: e.target.value},
        importDialog
      }),
      onIncorrectAnswerDelete: i => () => {
        const incorrectAnswers = addDialog.incorrectAnswers.slice();
        incorrectAnswers.splice(i, 1);
        this.setState({
          addDialog: { ...addDialog, incorrectAnswers},
          importDialog
        });
      },
      onIncorrectAnswerAdd: () => {
        const incorrectAnswers = addDialog.incorrectAnswers.slice();
        incorrectAnswers.push(addDialog.tempIncorrectAnswer);
        this.setState({
          addDialog: { ...addDialog, incorrectAnswers, tempIncorrectAnswer: ''},
          importDialog
        });
      },
      handleClose: confirm => () => {
        if (confirm) addQuestion(addDialog.question, addDialog.answer, addDialog.incorrectAnswers);
        this.setState({ addDialog: ADD_DIALOG_DEFAULT_STATE, importDialog });
      }
    };
    const importDialogHandlers = {
      onAmountChange: e => {
        const amount = e.target.value;
        if (
          IS_NATURAL_NUMBER.test(amount)
          && (+amount) <= 50 && (+amount) > 0
        ) this.setState({
          addDialog,
          importDialog: { ...importDialog, amount }
        });
      },
      onDifficultyChange: e => this.setState({
        addDialog,
        importDialog: { ...importDialog, difficulty: e.target.value }
      }),
      handleClose: confirm => () => {
        if (confirm) importQuestions(+importDialog.amount, importDialog.difficulty.toLowerCase());
        this.setState({ addDialog, importDialog: IMPORT_DIALOG_DEFAULT_STATE });
      }
    };

    const openAddDialog = () => this.setState({
      addDialog: { ...addDialog, open: true },
      importDialog
    });
    const openImportDialog = () => this.setState({
      addDialog,
      importDialog: { ...importDialog, open: true }
    });

    return (
      <CenteredListItem>
        <Tooltip title="Add question">
          <Button
            raised dense color="primary"
            onClick={openAddDialog}
          >
            <MDIcon>plus</MDIcon><MDIcon>keyboard</MDIcon>
          </Button>
        </Tooltip>
        <Space>4</Space>
        <Tooltip title="Import questions">
          <Button
            raised dense color="primary"
            onClick={openImportDialog}
          >
            <MDIcon>plus</MDIcon><MDIcon>web</MDIcon>
          </Button>
        </Tooltip>
        <AddDialog { ...{...addDialog, ...addDialogHandlers} } />
        <ImportDialog { ...{ ...importDialog, ...importDialogHandlers } } />
      </CenteredListItem>
    );
  }
}

export default QuestionListAddButtons;
