import { CardLabel, CitizenInfoLabel, FormStep, Loader, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";

const TLSelectPropertyID = ({ t, config, onSelect, value, userType, formData }) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [PropertyID, setPropertyID] = useState(formData.TradeDetails?.PropertyID);
  const tenantId = window.Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");
  const { isLoading } = window.Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear");

  function setSelectPropertyID(e) {
    setPropertyID(e.target.value);
  }

  const goNext = () => {
    onSelect(config.key, { PropertyID });
  };
  if (isLoading) {
    return <Loader></Loader>
  }

  return (
    <React.Fragment>
      <FormStep
        config={config}
        onSelect={goNext}
        onSkip={onSkip}
        t={t}
        isDisabled={!PropertyID}
      >
        <CardLabel>{`${t("TL_LOCALIZATION_PROPERTY_ID")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"text"}
          optionKey="i18nKey"
          name="PropertyID"
          value={PropertyID}
          onChange={setSelectPropertyID}
          disable={isEdit}
          {...(validation = { pattern: "^[a-zA-Z-.`' ]*$", isRequired: true, type: "text", title: t("TL_INVALID_PROPERYID") })}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_LICENSE_ISSUE_YEAR_INFO_MSG") } />}
    </React.Fragment>
  );
};

export default TLSelectPropertyID;
