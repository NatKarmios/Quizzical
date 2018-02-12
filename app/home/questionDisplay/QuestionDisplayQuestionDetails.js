// @flow
import React from 'react';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { InlineIcon } from '../../utils/components';


const QuestionDisplayQuestionDetails = ({ question, onDeleteButton }) => (
  <div style={{ width: '100%' }}>
    <Typography type="subheading" style={{ marginBottom: '5px' }}><i>{question.content}</i></Typography>
    <div style={{ textAlign: 'left', display: 'inline-block' }}>
      <span>
        <InlineIcon padded color="black" style={{ fontSize: '20px' }}>check-circle-outline</InlineIcon>
        <Typography type="body1" style={{ display: 'inline-block' }}><b>{question.correctAnswer}</b></Typography>
        <br/>
      </span>
      {
        question.incorrectAnswers.map(incorrectAnswer =>
          <span key={incorrectAnswer}>
            <InlineIcon padded color="black" style={{ fontSize: '20px' }}>close-circle-outline</InlineIcon>
            <Typography type="body1" style={{ display: 'inline-block' }}>{incorrectAnswer}</Typography>
            <br/>
          </span>
        )
      }
    </div>
    <br/><br/>
    <Button dense color="accent" onClick={onDeleteButton}>
      <InlineIcon padded>delete</InlineIcon>
      Delete Question
    </Button>
  </div>
);

export default QuestionDisplayQuestionDetails;
