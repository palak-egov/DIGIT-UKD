import {
  Banner,
  Card,
  CardText,
  LinkButton,
  Loader,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { stringToBoolean, formatFormDataToCreateTLApiObject } from "../utils";
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

  const tenantId = window.Digit.ULBService.getCurrentTenantId();
  const mutationCreate = window.Digit.Hooks.tl.useTradeLicenseAPI(
    data?.address?.city ? data.address?.city?.code : tenantId,
    true
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
    let formData = formatFormDataToCreateTLApiObject(data);
    console.log(formData, "API Data");
    mutationCreate.mutate(formData, { onSuccess });
  }, [fydata]);


  useEffect(() => {
    if (mutationCreate.isSuccess) {
      try {
        
      } catch (er) {
        console.info("error in update", er);
      }
    }
  }, [mutationCreate.isSuccess]);

  return mutationCreate.isLoading || mutationCreate.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker
        t={t}
        data={mutationCreate.data}
        isSuccess={mutationCreate.isSuccess}
        isLoading={mutationCreate.isLoading || mutationCreate.isIdle}
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
