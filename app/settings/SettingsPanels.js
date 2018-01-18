// @flow
import React from 'react';
import TextField from 'material-ui/TextField';

import { OptionList, OptionListItem } from './option';
import {getDefaultSetting, getSetting} from "../_modules/savedSettings";


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


const basicTextFieldProducer = (id, value, label, onChange) => (
  <TextField id={id} label={label} value={value} onChange={onChange}/>
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
  }
];


const SettingsPanels = ({ expanded, tempSettings, expandPanel, onTempSettingChange }) => {
  const handleExpansion = (newPanel) => () => { expandPanel(expanded, newPanel); };

  const optionCategoryToComponent = ({ title, subtitle, options, settingCategory }: OptionCategoryType, i) => {
    const optionToComponent = ({ componentProducer, label, settingLabel, optionSubtitle }: OptionType) => {
      const savedSettingValue = getSetting(settingCategory, settingLabel);
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

      return (
        <OptionListItem
          subtitle={optionSubtitle}
          key={`${settingCategory}_${settingLabel}`}
          changed={changed}
          onUndoButton={() => onTempSettingChange(settingCategory, settingLabel, null)}
          resettable={isResettable}
          onResetButton={() => onTempSettingChange(settingCategory, settingLabel, defaultSetting)}
        >
          {componentProducer(
            `${settingCategory}_${settingLabel}`,
            value,
            label,
            event => onTempSettingChange(settingCategory, settingLabel, event.target.value))}
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
