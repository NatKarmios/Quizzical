// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Tooltip from 'material-ui/Tooltip';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';

import { MDIcon } from '../../utils/components';

import PageButtons from './QuestionListPageButtons';
import AddButtons from './QuestionListAddButtons';
import * as QuestionListActions from './questionListActions';
import CenteredListItem from "../../utils/components/CenteredListItem";


const QuestionListItem = ({ question, enabled }) => (
  <ListItem button disabled={!enabled}>
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

const QuestionList = ({
  initialLoad, loading, questionCount, currentPage,
  loadedQuestions, loadQuestions, addQuestion, importQuestions
}) => {

  if (!initialLoad) loadQuestions(0);

  let listContent;
  if (!initialLoad || questionCount === 0) listContent =
    <CenteredListItem>
      <Typography><i>
        {loading ? 'Loading questions...' : 'No questions to show.'}
      </i></Typography>
    </CenteredListItem>;
  else listContent =
    loadedQuestions.map(question => (
      <QuestionListItem question={question} enabled={!loading} key={`q${question['questionID']}`}/>
    ));

  return (
    <List>
      {listContent}
      <Divider />
      <PageButtons
        loading={loading}
        currentPage={currentPage}
        questionCount={questionCount}
        loadNextPage={() => loadQuestions(currentPage+1)}
        loadPrevPage={() => loadQuestions(currentPage-1)}
      />
      <Divider />
      <AddButtons addQuestion={addQuestion} importQuestions={importQuestions}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList);
