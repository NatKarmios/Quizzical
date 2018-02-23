// @flow
import React from 'react';
import TextField from 'material-ui/TextField';

import { OptionList, OptionListItem } from './option';
import { getDefaultSetting, getSetting } from '../_modules/savedSettings';
import {isInteger, isNaturalNumber} from '../utils/helperFuncs';


type OptionType = {
  componentProducer?: ?any,
  validator?: ?any,
  label?: ?any,
  subtitle?: ?string,
  settingLabel: string
};

type OptionCategoryType = {
  title: any,
  subtitle?: ?any,
  options: Array<OptionType>,
  settingCategory: string
};


const basicTextField = (id, value, label, onChange, error=false, fullWidth=true) => (
  <TextField id={id} label={label} value={value} onChange={onChange} fullWidth={fullWidth} error={error}/>
);

const makeOption = (
  settingLabel, label, optionSubtitle, validator=()=>true, componentProducer=basicTextField
) => ({
  settingLabel, label, optionSubtitle, componentProducer, validator
});


const OPTIONS = [
  {
    settingCategory: 'chatMessages',
    title: 'Bot Chat Messages',
    subtitle: (
      <span>
        {'Customize what\'s sent to chat; any message can use {pointName}, {pointsName}, {streamer} and {bot}.'}
      </span>
    ),
    options: [
      makeOption('joinMessage', 'Join message', 'This is sent to chat once the bot connects.'),
      makeOption('questionStarted', 'Question announcement', 'Variables: {prize}, {rawPrize}, {timeLeft}'),
      makeOption('showQuestion', 'Show question', 'Variables: {question}, {prize}, {rawPrize}, {timeLeft}'),
      makeOption('questionCancelled', 'Question cancelled', 'Variables: {question}, {prize}, {rawPrize}'),
      makeOption('questionEndNoWinners', 'No winners', 'Variables: {question}, {prize}, {rawPrize}'),
      makeOption('questionEndSingleWinner', 'One winner', 'Variables: {question}, {prize}, {rawPrize}, {winner}'),
      makeOption('questionEndMultipleWinners', 'Multiple winners', 'Variables: {question}, {prize}, {rawPrize}, {winners}'),
      makeOption('answerReceived', 'Answer received', 'Variables: {question}, {prize}, {rawPrize}, {timeLeft}, {target}'),
      makeOption('alreadyAnswered', 'Viewer already answered', 'Variables: {question}, {prize}, {rawPrize}, {timeLeft}, {target}'),
      makeOption('invalidAnswer', 'Invalid answer', 'Variables: {question}, {prize}, {rawPrize}, {timeLeft}, {target}')
    ]
  },
  {
    settingCategory: 'misc',
    title: 'Miscellaneous',
    subtitle: '',
    options: [
      makeOption('pointName', 'Point name', 'The name of one unit of your stream points/currency'),
      makeOption(
        'pointsName', 'Points name (plural)', 'The plural name of your stream points/currency (i.e. more than one)'
      ),
      makeOption('defaultPrize', 'Default prize', 'The default prize when starting a question.', isInteger),
      makeOption('defaultDuration', 'Default duration', 'The default duration (in seconds) of a question.', isNaturalNumber)
    ]
  }
];


const SettingsPanels = ({ settings, expanded, tempSettings, expandPanel, onTempSettingChange }) => {
  const handleExpansion = (newPanel) => () => { expandPanel(expanded, newPanel); };

  const optionCategoryToComponent = ({ title, subtitle, options, settingCategory }: OptionCategoryType, i) => {
    const optionToComponent = ({ componentProducer, label, settingLabel, optionSubtitle, validator }: OptionType) => {
      const savedSettingValue = getSetting(settings, settingCategory, settingLabel);
      let tempSettingValue = null;
      if (tempSettings[settingCategory] !== null &&
          tempSettings[settingCategory] !== undefined &&
          tempSettings[settingCategory][settingLabel] !== null &&
          tempSettings[settingCategory][settingLabel] !== undefined)
        tempSettingValue = tempSettings[settingCategory][settingLabel];

      const changed = tempSettingValue !== null;
      const value = tempSettingValue !== null && tempSettingValue !== undefined ? tempSettingValue : savedSettingValue;

      const defaultSetting = getDefaultSetting(settingCategory, settingLabel);
      const isResettable = value !== defaultSetting;

      const updateTempSetting = (value, validator=()=>true) => onTempSettingChange(settings, settingCategory, settingLabel, value, validator);

      return (
        <OptionListItem
          subtitle={optionSubtitle}
          key={`${settingCategory}_${settingLabel}`}
          changed={changed}
          onUndoButton={() => updateTempSetting(null)}
          resettable={isResettable}
          onResetButton={() => updateTempSetting(defaultSetting)}
        >
          {
            componentProducer(
              `${settingCategory}_${settingLabel}`,
              value,
              label,
              event => updateTempSetting(event.target.value, validator),
              !validator(value)
            )
          }
        </OptionListItem>
      );
    };

    return (
      <OptionList
        title={title}
        subtitle={subtitle}
        expanded={expanded === i+1}
        onExpand={handleExpansion(i+1)}
        key={settingCategory}
      >
        {options.map(optionToComponent)}
      </OptionList>
    );
  };

  const optionsComponents = OPTIONS.map(optionCategoryToComponent);
  return <div>{optionsComponents}</div>;
};

export default SettingsPanels;
