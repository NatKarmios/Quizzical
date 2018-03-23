// @flow

import React from 'react';
import type { Node } from 'react';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import { MDIcon } from '../utils/components';

type Props = {
  primary: Node,
  secondary: Node,
  expanded: boolean,
  onChange: () => ?mixed,
  children: Node,
  classes: {
    heading: mixed,
    secondaryHeading: mixed
  }
};

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
});

const SettingsExpansionPanel = ({
  primary,
  secondary,
  expanded,
  onChange,
  children,
  classes
}: Props) => (
  <ExpansionPanel expanded={expanded} onChange={onChange}>
    <ExpansionPanelSummary
      expandIcon={<MDIcon color="rgba(0, 0, 0, 0.5)">chevron-down</MDIcon>}
    >
      <Typography className={classes.heading}>{primary}</Typography>
      <Typography className={classes.secondaryHeading}>{secondary}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
  </ExpansionPanel>
);

export default withStyles(styles)(SettingsExpansionPanel);
