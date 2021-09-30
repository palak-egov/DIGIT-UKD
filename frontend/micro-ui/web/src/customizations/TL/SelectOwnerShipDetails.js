import React, { useState, useEffect, useMemo } from "react";
import {
  FormStep,
  RadioOrSelect,
  RadioButtons,
  LabelFieldPair,
  Dropdown,
  CardLabel,
  CardLabelError,
} from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation } from "react-router-dom";

const SelectOwnerShipDetails = ({
  t,
  config,
  onSelect,
  userType,
  formData,
  onBlur,
  formState,
  setError,
  clearErrors,
}) => {
  const stateId = window.Digit.ULBService.getStateId();

  const { isLoading, data: Menu } = window.Digit.Hooks.tl.useTradeLicenseMDMS(
    stateId,
    "common-masters",
    ["OwnerShipCategory"],
    "",
    { select: (d) => d["common-masters"]["OwnerShipCategory"] }
  );

  const ownserShipTypeMenu = useMemo(() => {
    let obj = {};
    Menu?.forEach((e) => {
      let val = e.code.split(".")[0];
      obj[val] = val;
    });
    return Object.keys(obj).map((e) => ({ code: e }));
  }, [Menu]);

  const [mainOwnerShipType, setMainOwnership] = useState(null);
  const [ownership, setOwnerShip] = useState(null);

  const subOwnerShipMenu = useMemo(
    () => Menu?.filter((e) => e.code.split(".")[0] === mainOwnerShipType?.code),
    [mainOwnerShipType]
  );

  useEffect(() => {
    setOwnerShip(null);
  }, [mainOwnerShipType]);

  const goNext = (data) => {
    onSelect(config.key, { ...formData[config.key], ...data });
  };

  return (
    <FormStep t={t} config={config} onSelect={goNext}>
      <CardLabel>{t("TL_OWNERSHIP_TYPE")}</CardLabel>
      <RadioOrSelect
        options={ownserShipTypeMenu || []}
        onSelect={setMainOwnership}
        optionKey={"code"}
        selectedOption={mainOwnerShipType}
        t={t}
        isDependent={false}
        disabled={false}
      />
      {subOwnerShipMenu?.length ? (
        <React.Fragment>
          <CardLabel>{t("TL_SUBOWNERSHIP_TYPE")}</CardLabel>
          <RadioOrSelect
            options={subOwnerShipMenu || []}
            onSelect={setOwnerShip}
            optionKey={"code"}
            selectedOption={ownership}
            t={t}
            isDependent={false}
            disabled={false}
          />
        </React.Fragment>
      ) : null}
    </FormStep>
  );
};

const customize = () => {
  window.Digit.ComponentRegistryService.setComponent(
    "SelectOwnerShipDetails",
    SelectOwnerShipDetails
  );
};

export default customize;
