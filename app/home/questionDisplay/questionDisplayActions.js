// @flow

export const CHANGE_QUESTION =  'QUESTIONDISPLAY_CHANGE_QUESTION';
export const CHANGE_DURATION =  'QUESTIONDISPLAY_CHANGE_DURATION';
export const CHANGE_PRIZE =  'QUESTIONDISPLAY_CHANGE_PRIZE';
export const CHANGE_MULTIPLE_WINNERS =  'QUESTIONDISPLAY_CHANGE_MULTIPLE_WINNERS';
export const CHANGE_END_EARLY =  'QUESTIONDISPLAY_CHANGE_END_EARLY';
export const CHANGE_DELETE_DIALOG_OPEN = 'QUESTIONDISPLAY_CHANGE_DELETE_DIALOG_OPEN';
export const DELETE_QUESTION = 'DELETE_QUESTION';

const actionWithValue = type => value => ({
  type, payload: { value }
});

export const changeQuestion = actionWithValue(CHANGE_QUESTION);
export const changeDuration = actionWithValue(CHANGE_DURATION);
export const changePrize = actionWithValue(CHANGE_PRIZE);
export const changeMultipleWinners = actionWithValue(CHANGE_MULTIPLE_WINNERS);
export const changeEndEarly = actionWithValue(CHANGE_END_EARLY);

const changeDeleteDialogOpen = open => ({
  type: CHANGE_DELETE_DIALOG_OPEN,
  payload: { open }
});
export const openDeleteDialog = () => changeDeleteDialogOpen(true);
export const closeDeleteDialog = () => changeDeleteDialogOpen(false);

export const deleteQuestion = id => ({
  type: DELETE_QUESTION,
  payload: { id }
});
