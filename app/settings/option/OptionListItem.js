// @flow
import React from 'react';
import type { Node } from 'react';
import { withTheme } from 'material-ui/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

import { MDIcon } from '../../utils/components';

type SecondaryActionButtonProps = {
  tooltip: string,
  enabled: boolean,
  onClick: () => ?mixed,
  icon: string
};

type OptionListItemProps = {
  theme: {
    palette: {
      primary: {}
    }
  },
  subtitle: Node,
  changed: boolean,
  resettable: boolean,
  onUndoButton: () => ?mixed,
  onResetButton: () => ?mixed,
  children: Node
};

const SecondaryActionButton = ({
  tooltip,
  enabled,
  onClick,
  icon
}: SecondaryActionButtonProps) => (
  <Tooltip title={tooltip}>
    <div style={{ display: 'inline-block' }}>
      <IconButton disabled={!enabled} onClick={onClick}>
        <MDIcon>{icon}</MDIcon>
      </IconButton>
    </div>
  </Tooltip>
);

const OptionListItem = ({
  theme,
  subtitle,
  changed,
  resettable,
  onUndoButton,
  onResetButton,
  children
}: OptionListItemProps) => (
  <ListItem>
    <ListItemIcon>
      <Icon>
        <MDIcon
          color={changed ? theme.palette.primary[500] : 'rgba(0, 0, 0, 0.1)'}
        >
          alert-circle-outline
        </MDIcon>
      </Icon>
    </ListItemIcon>
    <ListItemText
      inset
      primary={children}
      secondary={subtitle}
      style={{ marginRight: '60px' }}
    />
    <ListItemSecondaryAction>
      <SecondaryActionButton
        tooltip="Undo changes"
        enabled={changed}
        onClick={onUndoButton}
        icon="undo"
      />
      <SecondaryActionButton
        tooltip="Reset to default"
        enabled={resettable}
        onClick={onResetButton}
        icon="backup-restore"
      />
    </ListItemSecondaryAction>
  </ListItem>
);

export default withTheme()(OptionListItem);
