import React, { useEffect, useMemo, useRef, useState } from "react";
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

const newOwner = {
  mobileNumber: "",
  ownerName: "",
  fatherHusbandName: "",
  relationship: "",
  gender: "",
  DOB: "",
  email: "",
  panNo: "",
  correspondenceAddress: "",
  tradeRelationship: "",
};

const SelectIndividualOwner = ({ t, config, onSelect, userType, formData }) => {
  let ismultiple = formData?.ownershipCategory?.code.includes("SINGLEOWNER")
    ? false
    : true;

  const [owners, setOwners] = useState(() => {
    return formData?.[config.key]?.owners?.length
      ? formData?.[config.key]?.owners
      : [newOwner];
    // return Object.keys(formData?.[config.key]).length
    //   ? Object.keys(formData?.[config.key])
    //       .sort()
    //       .map((key) => formData?.[config.key][key])
    //   : [newOwner];
  });

  useEffect(() => {
    console.log(owners, formData, "Form Value");
  }, [owners]);

  const setOwner = (index, owner) => {
    setOwners(owners?.map((e, i) => (index === i ? owner : e)));
  };

  const addOwner = () => {
    setOwners([...owners, newOwner]);
  };

  const goNext = () => {
    onSelect(config.key, {
      owners: owners?.map((e) => {
        const { errors, ...o } = e;
        return o;
      }),
    });
  };

  return (
    <FormStep
      config={config}
      onSelect={goNext}
      // isDisabled={
      //   owners?.filter?.((e) => Object.keys(e?.errors || {}).length)?.length
      // }
      t={t}
    >
      {owners?.map((_owner, i) => {
        const { ...owner } = _owner;
        return (
          <IndividualOwnerForm
            {...{ t, config, onSelect, userType, formData, setOwner, owner }}
            ownerIndex={i}
          />
        );
      })}
      {ismultiple && (
        <div>
          {/* <hr color="#d6d5d4" className="break-line"></hr> */}
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              paddingBottom: "15px",
              color: "#FF8C00",
            }}
          >
            <button
              type="button"
              style={{ paddingTop: "10px" }}
              onClick={() => addOwner()}
            >
              {t("TL_ADD_OWNER_LABEL")}
            </button>
          </div>
        </div>
      )}
    </FormStep>
  );
};

const IndividualOwnerForm = ({
  t,
  config,
  onSelect,
  userType,
  formData,
  owner,
  setOwner,
  ownerIndex,
}) => {
  const stateId = window.Digit.ULBService.getStateId();
  const { data: genderMenu } = window.Digit.Hooks.tl.useTLGenderMDMS(
    stateId,
    "common-masters",
    "GenderType",
    {}
  );

  let ismultiple = formData?.ownershipCategory?.code.includes("SINGLEOWNER")
    ? false
    : true;

  const defaultValues = {
    mobileNumber: owner?.mobileNumber,
    ownerName: owner?.ownerName,
    fatherHusbandName: owner?.fatherHusbandName,
    relationship: owner?.relationship,
    gender: owner?.gender,
    DOB: owner?.DOB,
    email: owner?.email,
    panNo: owner?.panNo,
    correspondenceAddress: owner?.correspondenceAddress,
    tradeRelationship: owner?.tradeRelationship,
  };

  const [_formValue, setFormValue] = useState(defaultValues);

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

  useEffect(() => {
    const keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = _formValue[key]));
    if (!_.isEqual(formValue, part)) {
      trigger();
      setFormValue(formValue);
      setOwner(ownerIndex, { ...formValue, errors });
    }
  }, [formValue]);

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    setOwner(ownerIndex, { ...formValue, errors });
  }, [errors]);

  return (
    <div
      style={
        ismultiple
          ? {
              border: "solid",
              borderRadius: "5px",
              padding: "10px",
              paddingTop: "20px",
              marginTop: "10px",
              borderColor: "#f3f3f3",
              background: "#FAFAFA",
            }
          : {}
      }
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
      <CardLabel>{t("TL_OWNER_NAME")}</CardLabel>
      <div className="field-container">
        <Controller
          name="ownerName"
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

      <CardLabel>{t("TL_RELATIONSHIP")}</CardLabel>
      <Controller
        name="relationship"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <RadioOrSelect
            options={relationshipMenu || []}
            onSelect={onChange}
            selectedOption={value}
            optionKey={"i18nKey"}
            onBlur={onBlur}
            t={t}
          />
        )}
      />

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

      {/* <CardLabel>{t("TL_RELATIONSHIP_LABEL")}</CardLabel>
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
      /> */}

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
    </div>
  );
};

export default SelectIndividualOwner;
