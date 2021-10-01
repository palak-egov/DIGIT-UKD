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
  const selectedValue = formData?.[config.key]?.ownership;

  const stateId = window.Digit.ULBService.getStateId();

  const { isLoading, data: Menu } = window.Digit.Hooks.tl.useTradeLicenseMDMS(
    stateId,
    "common-masters",
    ["OwnerShipCategory"],
    "",
    { select: (d) => d["common-masters"]["OwnerShipCategory"] }
  );

  const [mainOwnerShipType, setMainOwnership] = useState({
    code: selectedValue.split(".")[0],
  });
  const [ownership, setOwnerShip] = useState(() => ({
    code: selectedValue,
  }));

  const ownserShipTypeMenu = useMemo(() => {
    let obj = {};
    Menu?.forEach((e) => {
      let val = e.code.split(".")[0];
      obj[val] = val;
    });
    return Object.keys(obj).map((e) => ({ code: e }));
  }, [Menu]);

  const subOwnerShipMenu = useMemo(
    () => Menu?.filter((e) => e.code.split(".")[0] === mainOwnerShipType?.code),
    [mainOwnerShipType]
  );

  useEffect(() => {
    if (!ownership?.code?.includes(mainOwnerShipType?.code)) {
      setOwnerShip(null);
    }
  }, [mainOwnerShipType]);

  useEffect(() => {
    if (Menu?.length) {
      setMainOwnership(
        ownserShipTypeMenu.find((o) => selectedValue.split(".")[0] === o?.code)
      );
      setOwnerShip(subOwnerShipMenu?.find((o) => selectedValue === o.code));
    }
  }, [Menu]);

  console.log(selectedValue, ownership, subOwnerShipMenu, "selectedValue");

  const goNext = (data) => {
    onSelect(config.key, { ownership: ownership?.code });
  };

  return (
    <FormStep
      t={t}
      config={config}
      onSelect={goNext}
      isDisabled={!ownership?.code}
    >
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
