import React, { useEffect, useState } from "react";
import {
  FormStep,
  TextInput,
  CardLabel,
  RadioOrSelect,
  MobileNumber,
  DatePicker,
} from "@egovernments/digit-ui-react-components";
import {} from "";

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

  useEffect(() => {
    console.log(genderMenu, "MENU");
  }, [genderMenu]);

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

  const [mobileNumber, setMobileNumber] = useState("");
  const [authorisedPersonName, setAuthorisedPersonName] = useState("");
  const [fatherHusbandName, setFatherHusbandName] = useState("");
  const [gender, setGender] = useState(null);
  const [email, setEmail] = useState("");
  const [tradeRelationship, setTradeRelatioship] = useState(null);
  const [officialMobileNumber, setOfficialMobileNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [corrAddress, setCorrAddress] = useState("");
  const [relationship, setRelationship] = useState(null);
  const [DOB, setDOB] = useState(null);

  const disabled = () => {
    let obj = {
      mobileNumber,
      authorisedPersonName,
      fatherHusbandName,
      gender,
      email,
      tradeRelationship,
      officialMobileNumber,
      designation,
      corrAddress,
      relationship,
      DOB,
    };
  };

  const goNext = () => {
    onSelect(config.key, {
      ...formData?.[config.key],
      mobileNumber,
      authorisedPersonName,
      fatherHusbandName,
      gender,
      email,
      tradeRelationship,
      officialMobileNumber,
      designation,
      corrAddress,
      relationship,
      DOB,
    });
  };

  return (
    <FormStep config={config} onSelect={goNext} onSkip={() => {}} t={t}>
      <CardLabel>{t("TL_MOBILE_NUMBER_LABEL")}</CardLabel>
      <MobileNumber onChange={setMobileNumber} value={mobileNumber} />
      <CardLabel>{t("TL_AUTHORISED_PERSON_LABEL")}</CardLabel>
      <div className="field-container">
        <TextInput
          value={authorisedPersonName}
          onChange={(e) => setAuthorisedPersonName(e.target.value)}
        />
      </div>
      <CardLabel>{t("TL_FATHER_HUSBAND_NAME_LABEL")}</CardLabel>
      <div className="field-container">
        <TextInput
          value={fatherHusbandName}
          onChange={(e) => setFatherHusbandName(e.target.value)}
        />
      </div>
      <CardLabel>{t("TL_GENDER_LABEL")}</CardLabel>
      <RadioOrSelect
        options={genderMenu || []}
        onSelect={setGender}
        selectedOption={gender}
        optionKey={"i18nKey"}
        t={t}
      />
      <CardLabel>{t("TL_TRADE_RELATIONSHIP")}</CardLabel>
      <RadioOrSelect
        options={TradeRelationshipMenu || []}
        onSelect={setTradeRelatioship}
        selectedOption={tradeRelationship}
        optionKey={"i18nKey"}
        t={t}
      />
      <CardLabel>{t("TL_EMAIL_LABEL")}</CardLabel>
      <div className="field-container">
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <CardLabel>{t("TL_OFFICIAL_MOBILE_NUMBER_LABEL")}</CardLabel>
      <MobileNumber
        onChange={setOfficialMobileNumber}
        value={officialMobileNumber}
      />
      <CardLabel>{t("TL_DESIGNATION_LABEL")}</CardLabel>
      <div className="field-container">
        <TextInput
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
      </div>

      <CardLabel>{t("TL_RELATIONSHIP_LABEL")}</CardLabel>
      <RadioOrSelect
        options={relationshipMenu}
        selectedOption={relationship}
        onSelect={setRelationship}
        optionKey={"i18nKey"}
        t={t}
      />

      <CardLabel>{t("TL_DATE_OF_BIRTH_LABEL")}</CardLabel>
      <DatePicker onChange={setDOB} date={DOB} />

      <CardLabel>{t("TL_CORRESPONDENCE_ADDRESS_LABEL")}</CardLabel>
      <div className="field-container">
        <TextInput
          value={corrAddress}
          onChange={(e) => setCorrAddress(e.target.value)}
        />
      </div>
    </FormStep>
  );
};

export default SelectNonIndividualOwner;
