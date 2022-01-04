import {
  Banner,
  Card,
  CardText,
  LinkButton,
  Loader,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { stringToBoolean, formatFormDataToCreateTLApiObject, formatResponseDataToCreateTLApiObject } from "../utils";
import {useTranslation } from "react-i18next"

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return !window.location.href.includes("renew-trade")
      ? t("CS_TRADE_APPLICATION_SUCCESS")
      : t("CS_TRADE_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return !window.location.href.includes("renew-trade")
      ? t("CS_TRADE_APPLICATION_SUCCESS")
      : t("CS_TRADE_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("renew-trade")
      ? t("CS_TRADE_APPLICATION_FAILED")
      : t("CS_TRADE_UPDATE_APPLICATION_FAILED");
  }
};

const BannerPicker = (props) => {
  return (
    <Banner
      message={GetActionMessage(props)}
      applicationNumber={props.data?.Licenses[0]?.applicationNumber}
      info={props.isSuccess ? props.t("TL_REF_NO_LABEL") : ""}
      successful={props.isSuccess}
    />
  );
};


const TLAcknowledgement = ({ data, onSuccess, t = (a) => a }) => {

  const [mutationHappened, setMutationHappened, clear] =
    window.Digit.Hooks.useSessionStorage("CITIZEN_TL_MUTATION_HAPPENED", false);

  const isEdit = window.location.href.includes("edit-application");

  const tenantId = window.Digit.ULBService.getCurrentTenantId();
  const mutationCreate = window.Digit.Hooks.tl.useTradeLicenseAPI(
    data?.address?.city ? data.address?.city?.code : tenantId,
    true
  );

  const mutationUpdate = window.Digit.Hooks.tl.useTradeLicenseAPI(
    data?.address?.city ? data.address?.city?.code : tenantId,
    false
  );

  const { data: storeData } = window.Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const stateId = tenantId.split(".")[0];
  const { isLoading, data: fydata } = window.Digit.Hooks.tl.useTradeLicenseMDMS(
    stateId,
    "egf-master",
    "FinancialYear"
  );
 
  useEffect(() => {
    const onSuccessedit = () => {
      setMutationHappened(true);
    };
    if (fydata) {
      let formData = formatFormDataToCreateTLApiObject(data);
      if (!isEdit) {
        mutationCreate.mutate(formData, {
          onSuccess: (d) => {
            console.log(d.Licenses, ">>>>>>>");
            const updateData = formatResponseDataToCreateTLApiObject(
              d.Licenses[0],
              data
            );
            mutationUpdate.mutate(updateData, { onSuccess });
          },
        });
      } else {
        console.log(data, "here is edit Data");
        // mutationUpdate.mutate(updateData, { onSuccess });
      }
    }
  }, [fydata]);


  useEffect(() => {
    if (mutationCreate.isSuccess) {
      try {
        
      } catch (er) {
        console.info("error in update", er);
      }
    }
  }, [mutationCreate.isSuccess]);

  return mutationCreate.isLoading ||
    mutationCreate.isIdle ||
    mutationUpdate.isLoading ||
    mutationUpdate?.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker
        t={t}
        data={mutationUpdate.data}
        isSuccess={mutationUpdate.isSuccess}
        isLoading={
          mutationCreate.isLoading ||
          mutationCreate.isIdle ||
          mutationUpdate.isLoading ||
          mutationUpdate.isIdle
        }
      />
    </Card>
  );
};

const customize = () => {
  window.Digit.ComponentRegistryService.setComponent(
    "TLAcknowledgement",
    TLAcknowledgement
  );
};

export default customize;
