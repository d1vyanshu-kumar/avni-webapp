import { FormHelperText } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";

export const ValidationError = ({ validationResult }) => {
  const { t } = useTranslation();

  const renderErrorMessage = () => {
    return <FormHelperText error>{t(validationResult.messageKey, validationResult.extra)}</FormHelperText>;
  };

  return validationResult ? renderErrorMessage() : <div />;
};
