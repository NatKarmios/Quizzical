// @flow
/* eslint-disable flowtype/no-weak-types */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Tooltip from 'material-ui/Tooltip';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';

import type { QuestionType } from '../../utils/types';
import { MDIcon, PageButtons } from '../../utils/components';
import { numPages } from '../../utils/helperFuncs';

import QuestionListButtons from './QuestionListAddButtons';
import * as QuestionListActions from './questionListActions';
import CenteredListItem from '../../utils/components/CenteredListItem';


type QuestionListItemProps = {
  question: QuestionType,
  enabled: boolean,
  onClick: () => any
};

type QuestionListProps = {
  initialLoad: boolean,
  loading: boolean,
  questionCount: number,
  currentPage: number,
  loadedQuestions: Array<QuestionType>,
  loadQuestions: number => any,
  addQuestion: () => any,
  importQuestions: () => any,
  selectQuestion: QuestionType => any
};

const p = x => { console.log(x); return x }


const QuestionListItem = ({ question, enabled, onClick }: QuestionListItemProps) => (
  <ListItem button onClick={onClick} disabled={!enabled}>
    <ListItemText
      primary={<Typography type="body1">{question.content}</Typography>}
    />
    {
      question.external ? (
        <Tooltip title="Imported" style={{ float: 'right' }} placement="right">
          <IconButton style={{ width: '24px', height: '24px' }} disableRipple>
            <MDIcon style={{ fontSize: '20px' }}>web</MDIcon>
          </IconButton>
        </Tooltip>
      ) : null
    }
  </ListItem>
);

const QuestionList = (props: QuestionListProps) => {

  const {
    initialLoad, loading, questionCount, currentPage,
    loadedQuestions, loadQuestions, addQuestion, importQuestions, selectQuestion
  } = props;

  if (!initialLoad) loadQuestions(0);

  let listContent;
  if (!initialLoad || questionCount === 0) {
    listContent = (
      <CenteredListItem>
        <Typography><i>
          {loading ? 'Loading questions...' : 'No questions to show.'}
        </i></Typography>
      </CenteredListItem>
    );
  } else {
    listContent =
      loadedQuestions.map(question => (
        <QuestionListItem
          question={question}
          enabled={!loading}
          key={`q${question.questionID}`}
          onClick={() => selectQuestion(question)}
        />
      ));
  }


  const pageButtons = (
      <PageButtons
        loading={loading}
        currentPage={currentPage}
        maxPage={numPages(questionCount)}
        loadNextPage={() => loadQuestions(currentPage + 1)}
        loadPrevPage={() => loadQuestions(currentPage - 1)}
      />
  );

  return (
    <List>
      <QuestionListButtons addQuestion={addQuestion} importQuestions={importQuestions} />
      <Divider />
      {pageButtons}
      <Divider />
      {listContent}
      <Divider />
      {pageButtons}
    </List>
  );
};

const mapStateToProps = state => ({
  initialLoad: state.questionList.initialLoad,
  loading: state.questionList.loading,
  questionCount: state.questionList.questionCount,
  currentPage: state.questionList.currentPage,
  loadedQuestions: state.questionList.loadedQuestions
});

const mapDispatchToProps = (dispatch) => bindActionCreators(QuestionListActions, dispatch);


// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(QuestionList);
