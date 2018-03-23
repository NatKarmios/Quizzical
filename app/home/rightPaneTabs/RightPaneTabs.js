// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tabs, { Tab } from 'material-ui/Tabs';

import QuestionDisplay from '../questionDisplay/QuestionDisplay';
import ActiveQuestionDisplay from '../activeQuestion/ActiveQuestionDisplay';
import QuestionHistory from '../questionHistory/QuestionHistory';

import * as RightPaneTabsActions from './rightPaneTabsActions';

const getTabContents = (activeQuestion: boolean, tab: number) => {
  switch (tab) {
    case 0:
      return activeQuestion ? <ActiveQuestionDisplay /> : <QuestionDisplay />;
    case 1:
      return <QuestionHistory />;
    default:
      return "Something's gone wrong!";
  }
};

type Props = {
  activeQuestion: boolean,
  tab: number,
  changeTab: number => ?mixed
};

const RightPaneTabs = ({ activeQuestion, tab, changeTab }: Props) => (
  <div>
    <Tabs
      value={tab}
      indicatorColor="primary"
      textColor="primary"
      centered
      fullWidth
      onChange={(e, value) => changeTab(value)}
    >
      <Tab label={activeQuestion ? 'Active Question' : 'Start a Question'} />
      <Tab label="Past Question Data" />
    </Tabs>
    {getTabContents(activeQuestion, tab)}
  </div>
);

const mapStateToProps = state => ({
  tab: state.rightPaneTabs.tab
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(RightPaneTabsActions, dispatch);

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(RightPaneTabs);
