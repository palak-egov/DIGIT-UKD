import React, { useEffect, useState } from "react";
import {
  FormStep,
  TextInput,
  CardLabel,
  RadioOrSelect,
  MobileNumber,
  DatePicker,
} from "@egovernments/digit-ui-react-components";

import { useForm, Controller } from "react-hook-form";

import _ from "lodash";

const SelectNonIndividualOwner = ({
  t,
  config,
  onSelect,
  userType,
  formData,
}) => {
  const stateId = window.Digit.ULBService.getStateId();
  const { data: genderMenu } = window.Digit.Hooks.tl.useTLGenderMDMS(
    stateId,
    "common-masters",
    "GenderType",
    {}
  );

  const defaultValues = {
    mobileNumber: "",
    authorisedPersonName: "",
    fatherHusbandName: "",
    gender: "",
    tradeRelationship: "",
    email: "",
    designation: "",
    relationship: "",
    DOB: "",
    correspondenceAddress: "",
  };

  const [_formValue, setFormValue] = useState(defaultValues);

  useEffect(() => {
    trigger();
  }, []);

  const TradeRelationshipMenu = [
    { i18nKey: "TL_PROPRIETOR", code: "PROPRIETOR" },
    { i18nKey: "TL_PARTNER", code: "PARTNER" },
    { i18nKey: "TL_DIRECTOR", code: "DIRECTOR" },
    { i18nKey: "TL_AUTHORIZEDSIGNATORY", code: "AUTHORIZEDSIGNATORY" },
  ];

  const relationshipMenu = [
    { i18nKey: "TL_FATHER", code: "FATHER" },
    { i18nKey: "TL_HUSBAND", code: "HUSBAND" },
  ];

  const { control, setError, setValue, formState, watch, trigger } = useForm({
    defaultValues,
  });

  const { errors } = formState;

  const formValue = watch();

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], ...formValue });
  };

  useEffect(() => {
    const keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = _formValue[key]));
    if (!_.isEqual(formValue, part)) {
      trigger();
      setFormValue(formValue);
    }
  }, [formValue]);

  console.log(errors, formValue, "errors here");

  return (
    <FormStep
      config={config}
      onSelect={goNext}
      isDisabled={Object.keys(errors).length > 0}
      t={t}
    >
      <CardLabel>{t("TL_MOBILE_NUMBER_LABEL")}</CardLabel>
      <Controller
        name="mobileNumber"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <MobileNumber onChange={onChange} value={value} />
        )}
      />
      <CardLabel>{t("TL_AUTHORISED_PERSON_LABEL")}</CardLabel>
      <div className="field-container">
        <Controller
          name="authorisedPersonName"
          rules={{ required: true, pattern: /^[a-zA-Z]{1,}$/ }}
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              onBlur={onBlur}
            />
          )}
        />
      </div>
      <CardLabel>{t("TL_FATHER_HUSBAND_NAME_LABEL")}</CardLabel>
      <div className="field-container">
        <Controller
          name="fatherHusbandName"
          rules={{ required: true, pattern: /^[a-zA-Z]{1,}$/ }}
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        />
      </div>
      <CardLabel>{t("TL_GENDER_LABEL")}</CardLabel>
      <Controller
        name="gender"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <RadioOrSelect
            options={genderMenu || []}
            onSelect={onChange}
            selectedOption={value}
            optionKey={"i18nKey"}
            onBlur={onBlur}
            t={t}
          />
        )}
      />

      <CardLabel>{t("TL_TRADE_RELATIONSHIP")}</CardLabel>
      <Controller
        name="tradeRelationship"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <RadioOrSelect
            options={TradeRelationshipMenu || []}
            onSelect={onChange}
            selectedOption={value}
            optionKey={"i18nKey"}
            onBlur={onBlur}
            t={t}
          />
        )}
      />
      <CardLabel>{t("TL_EMAIL_LABEL")}</CardLabel>
      <Controller
        name="email"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <div className="field-container">
            <TextInput
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )}
      />

      <CardLabel>{t("TL_OFFICIAL_MOBILE_NUMBER_LABEL")}</CardLabel>
      <Controller
        name="mobileNumber"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <MobileNumber onChange={onChange} value={value} />
        )}
      />
      <CardLabel>{t("TL_DESIGNATION_LABEL")}</CardLabel>
      <Controller
        name="designation"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <div className="field-container">
            <TextInput
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )}
      />

      <CardLabel>{t("TL_RELATIONSHIP_LABEL")}</CardLabel>
      <Controller
        name="relationship"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <RadioOrSelect
            options={relationshipMenu}
            selectedOption={value}
            onSelect={onChange}
            optionKey={"i18nKey"}
            t={t}
          />
        )}
      />

      <CardLabel>{t("TL_DATE_OF_BIRTH_LABEL")}</CardLabel>
      <Controller
        name="DOB"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <DatePicker onChange={onChange} date={value} />
        )}
      />

      <CardLabel>{t("TL_CORRESPONDENCE_ADDRESS_LABEL")}</CardLabel>
      <Controller
        name="correspondenceAddress"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <div className="field-container">
            <TextInput
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )}
      />
    </FormStep>
  );
};

export default SelectNonIndividualOwner;
