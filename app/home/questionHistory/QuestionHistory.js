// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel } from 'material-ui/Form';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import Table, {
  TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination
} from 'material-ui/Table';

import { ordinal } from '../../utils/helperFuncs';
import { Space, PageButtons } from '../../utils/components';
import type { UsedQuestionType } from '../../utils/types';
import * as QuestionHistoryActions from './questionHistoryActions';
import {getUsedQuestionList} from "../../_modules/db/dbQueries";

import style from './style.scss';


type DropdownOptionsType = {
  value: string,
  label: string
}


const orderByOptions: Array<DropdownOptionsType> = [
  {
    value: 'finishTime',
    label: 'Time Finished'
  },
  {
    value: 'questionID',
    label: 'Time Question Added'
  },
  {
    value: 'prize',
    label: 'Prize'
  },
  {
    value: 'duration',
    label: 'Question Duration'
  },
  {
    value: 'winnerCount',
    label: 'Number of Winners'
  }
];

const ascOrDescOptions: Array<DropdownOptionsType> = [
  {
    value: 'ASC',
    label: 'Ascending'
  },
  {
    value: 'DESC',
    label: 'Descending'
  }
]


type DropdownProps = {
  label: string,
  value: string,
  options: Array<DropdownOptionsType>,
  onChange: string => any
}

const Dropdown = ({label, value, options, onChange}) => (
  <TextField
    select
    fullWidth
    label={label}
    value={value}
    onChange={e => onChange(e.target.value)}
  >
    {options.map(option => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);


const getTimeString = (date: Date) => {
  const hours = date.getHours();
  const rawMins = date.getMinutes();
  const mins = `${rawMins < 10 ? '0' : ''}${rawMins}`
  const amOrPm = hours < 12 ? 'AM' : 'PM';
  return `${hours % 12}:${mins} ${amOrPm}`;
}

const getDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ][date.getMonth()];
  const day = ordinal(date.getDate());
  return `${day} ${month} ${year}`;
}


const Cell = (props) => (
  <TableCell padding="dense" {...props} >
  </TableCell>
)

type ResultsTableProps = {
  data: Array<UsedQuestionType>,
  count: number,
  page: number,
  onPageChange: number => any
};

const ResultsTable = ({ data, count, page, onPageChange }: ResultsTableProps) => (
  <div className={style.scrollwrap}>
    <div className={style.scrollbar} >
      <div style={{ minWidth: '800px' }} >
        <Table>
          <TableHead>
            <TableRow>
              <Cell>Question</Cell>
              <Cell>Time</Cell>
              <Cell>Date</Cell>
              <Cell numeric>Winners</Cell>
              <Cell numeric>Duration</Cell>
              <Cell numeric>Prize</Cell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(({usedQuestionID, question, finishTime, winners, duration, prize}: UsedQuestionType) =>
              <TableRow key={usedQuestionID}>
                <Cell>
                  {(
                    <Tooltip title={question.content}>
                      <div>
                        {
                          question.content.length > 35 ?
                            `${question.content.substring(0, 32)}...` :
                            question.content
                        }
                      </div>
                    </Tooltip>
                  )}
                </Cell>
                <Cell>{getTimeString(finishTime)}</Cell>
                <Cell>{getDateString(finishTime)}</Cell>
                <Cell numeric>{winners}</Cell>
                <Cell numeric>{duration}</Cell>
                <Cell numeric>{prize}</Cell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={count}
                onChangePage={(e, newPage) => onPageChange(newPage) }
                page={page}
                rowsPerPage={10}
                rowsPerPageOptions={[10]}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  </div>
)



type Props = {
  sortBy: string,
  sortOrder: string,
  includeCancelled: boolean,
  questionSearch: string,
  prevSortBy: string,
  prevSortOrder: string,
  prevIncludeCancelled: boolean,
  prevQuestionSearch: string,
  loadedHistory: Array<UsedQuestionType>,
  recordCount: number,
  page: number,
  loading: boolean,
  initialLoad: boolean,
  changeSortBy: string => any,
  changeSortOrder: string => any,
  changeIncludeCancelled: boolean => any,
  changeQuestionSearch: string => any,
  loadHistory: (string, string, boolean, string, number) => any
}


const QuestionHistory = ({
  sortBy, sortOrder, includeCancelled, questionSearch,
  prevSortBy, prevSortOrder, prevIncludeCancelled, prevQuestionSearch,
  loadedHistory, recordCount, page, loading, initialLoad,
  changeSortBy, changeSortOrder, changeIncludeCancelled, changeQuestionSearch, loadHistory
}: Props) => (
  <div style={{ padding: '30px', textAlign: 'center' }}>
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Dropdown label="Sort By" value={sortBy} options={orderByOptions} onChange={changeSortBy} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Dropdown label="Sort Order" value={sortOrder} options={ascOrDescOptions} onChange={changeSortOrder} />
      </Grid>
    </Grid>
    <br />
    <Grid container>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Question contains..."
          fullWidth
          value={questionSearch}
          onChange={e => changeQuestionSearch(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeCancelled}
              color="primary"
              onChange={e => changeIncludeCancelled(e.target.checked)}
            />
          }
          label="Include cancelled questions"
        />
      </Grid>
    </Grid>
    <br />
    <Button
      raised
      color="primary"
      onClick={
        () => loadHistory(sortBy, sortOrder, includeCancelled, questionSearch, 0)
      }
    >Submit</Button>

    <Divider style={{ margin: '10px 0' }} />

    {
      !initialLoad || loading ? (
        <Typography><i>{
          loading ?
            'Loading...' :
            'Click the submit button to search...'
        }</i></Typography>
      ) : null
    }
    {
      initialLoad && !loading ? (
        <ResultsTable
          data={loadedHistory}
          count={recordCount}
          page={page}
          onPageChange={
            newPage => loadHistory(prevSortBy, prevSortOrder, prevIncludeCancelled, prevQuestionSearch, newPage)
          }
        />
      ) : null
    }
  </div>
);


const mapStateToProps = state => ({
  ...state.questionHistory
});

const mapDispatchToProps = dispatch => bindActionCreators(QuestionHistoryActions, dispatch);


// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(QuestionHistory);
