import {
  CardLabel,
  CitizenInfoLabel,
  FormStep,
  Loader,
  TextInput,
} from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import SelectOwnerDetails from "./SelectOwnerDetails";
import SelectStreet from "./SelectStreet";
import TLSelectPropertyID from "./TLSelectPropertyID";
import TLTradeDetailsEmployee from "./TLTradeDetailsEmployee";

const SelectTradeName = ({
  t,
  config,
  onSelect,
  value,
  userType,
  formData,
}) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [TradeName, setTradeName] = useState(formData.TradeDetails?.TradeName);
  const tenantId = window.Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const isEdit =
    window.location.href.includes("/edit-application/") ||
    window.location.href.includes("renew-trade");
  const { isLoading, data: fydata = {} } =
    window.Digit.Hooks.tl.useTradeLicenseMDMS(
      stateId,
      "egf-master",
      "FinancialYear"
    );

  console.log("formData", formData);

  let mdmsFinancialYear = fydata["egf-master"]
    ? fydata["egf-master"].FinancialYear.filter((y) => y.module === "TL")
    : [];
  let FY =
    mdmsFinancialYear &&
    mdmsFinancialYear.length > 0 &&
    mdmsFinancialYear.sort((x, y) => y.endingDate - x.endingDate)[0]?.code;
  function setSelectTradeName(e) {
    setTradeName(e.target.value);
  }

  const goNext = () => {
    sessionStorage.setItem("CurrentFinancialYear", FY);
    onSelect(config.key, { TradeName });
  };

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <React.Fragment>
      <FormStep
        config={config}
        onSelect={goNext}
        onSkip={onSkip}
        t={t}
        isDisabled={!TradeName}
      >
        <CardLabel>{`${t("new Name After Cusomization")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"text"}
          optionKey="i18nKey"
          name="TradeName"
          value={TradeName}
          onChange={setSelectTradeName}
          disable={isEdit}
          {...(validation = {
            pattern: "^[a-zA-Z-.`' ]*$",
            isRequired: true,
            type: "text",
            title: t("TL_INVALID_TRADE_NAME"),
          })}
        />
      </FormStep>
      {
        <CitizenInfoLabel
          info={t("CS_FILE_APPLICATION_INFO_LABEL")}
          text={t("TL_LICENSE_ISSUE_YEAR_INFO_MSG") + FY}
        />
      }
    </React.Fragment>
  );
};

const customize = () => {
  window.Digit.ComponentRegistryService.setComponent(
    "SelectTradeName",
    SelectTradeName
  );
  window.Digit.ComponentRegistryService.setComponent(
    "SelectOwnerDetails",
    SelectOwnerDetails
  ); 
  window.Digit.ComponentRegistryService.setComponent(
    "SelectStreet",
    SelectStreet
  ); 
  window.Digit.ComponentRegistryService.setComponent(
    "TLSelectPropertyID",
    TLSelectPropertyID
  ); 
  window.Digit.ComponentRegistryService.setComponent(
    "TLTradeDetailsEmployee",
    TLTradeDetailsEmployee  );

  
};

export default customize;
