// @flow
import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { MDIcon, HeaderLinkButton } from '../utils/components';
import QuestionList from './questionList/QuestionList';
import QuestionDisplay from './questionDisplay/QuestionDisplay';
import ActiveQuestionDisplay from './activeQuestion/ActiveQuestionDisplay';
import ActiveQuestionUserList from './activeQuestion/ActiveQuestionUserList';


type Props = {
  activeQuestionUI: boolean
};


const Home = ({ activeQuestionUI }: Props) => (
  <div style={{ margin: '20px' }}>
    <Paper style={{ padding: '20px' }}>
      <Typography type="headline">
        <MDIcon color="black" style={{ marginRight: '5px' }}>home</MDIcon>
        Home
        <HeaderLinkButton
          tooltipText="To settings"
          linkTo="/settings"
          icons={['settings']}
          width="70px"
        />
      </Typography>
    </Paper>
    <br />
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Paper>
          {activeQuestionUI ? <ActiveQuestionUserList /> : <QuestionList />}
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper style={{ padding: '20px' }}>
          {activeQuestionUI ? <ActiveQuestionDisplay /> : <QuestionDisplay />}
        </Paper>
      </Grid>
    </Grid>
  </div>
);

const mapStateToProps = state => ({
  activeQuestionUI: state.global.activeQuestion.uiActive
});

export default connect(mapStateToProps)(Home);
