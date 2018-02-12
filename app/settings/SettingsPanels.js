// @flow
import React from 'react';
import TextField from 'material-ui/TextField';

import { OptionList, OptionListItem } from './option';
import { getDefaultSetting, getSetting } from '../_modules/savedSettings';


type OptionType = {
  componentGetter?: ?any,
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


const basicTextFieldProducer = (id, value, label, onChange, fullWidth=true) => (
  <TextField id={id} label={label} value={value} onChange={onChange} fullWidth={fullWidth}/>
);


const OPTIONS = [
  {
    settingCategory: 'general',
    title: 'General settings',
    subtitle: 'testing!',
    options: [
    ]
  },
  {
    settingCategory: 'chatMessages',
    title: 'Bot Chat Messages',
    subtitle: (
      <span>
          Use <i>{'{viewer}'}</i> and <i>{'{points}'}</i> where appropriate.
        </span>
    ),
    options: [
      {
        settingLabel: 'joinMessage',
        componentProducer: basicTextFieldProducer,
        label: 'Join Message',
        optionSubtitle: 'This is sent to chat once the bot connects.'
      }
    ]
  },
  {
    settingCategory: 'misc',
    title: 'Miscellaneous',
    subtitle: 'Everything else here.',
    options: [
      {
        settingLabel: 'pointName',
        componentProducer: basicTextFieldProducer,
        label: 'Point name',
        optionSubtitle: 'The name of one unit of your stream points/currency',
      },
      {
        settingLabel: 'pointsName',
        componentProducer: basicTextFieldProducer,
        label: 'Points name (plural)',
        optionSubtitle: 'The plural name of your stream points/currency (i.e. more than one)'
      }
    ]
  }
];


const SettingsPanels = ({ settings, expanded, tempSettings, expandPanel, onTempSettingChange }) => {
  const handleExpansion = (newPanel) => () => { expandPanel(expanded, newPanel); };

  const optionCategoryToComponent = ({ title, subtitle, options, settingCategory }: OptionCategoryType, i) => {
    const optionToComponent = ({ componentProducer, label, settingLabel, optionSubtitle }: OptionType) => {
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

      const updateTempSetting = value => onTempSettingChange(settings, settingCategory, settingLabel, value);

      return (
        <OptionListItem
          subtitle={optionSubtitle}
          key={`${settingCategory}_${settingLabel}`}
          changed={changed}
          onUndoButton={() => updateTempSetting(null)}
          resettable={isResettable}
          onResetButton={() => updateTempSetting(defaultSetting)}
        >
          {componentProducer(
            `${settingCategory}_${settingLabel}`,
            value,
            label,
            event => updateTempSetting(event.target.value))}
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
