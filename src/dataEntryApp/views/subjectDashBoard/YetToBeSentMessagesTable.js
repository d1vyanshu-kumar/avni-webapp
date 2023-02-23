import React from "react";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/General";
import MaterialTable from "material-table";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  labelStyle: {
    color: "red",
    backgroundColor: "#ffeaea",
    fontSize: "12px",
    alignItems: "center",
    margin: 0
  },
  infoMsg: {
    marginLeft: 10
  }
}));

const YetToBeSentMessagesTable = ({ msgsYetToBeSent, isMsgsNotYetSentAvailable }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const columns = [
    {
      title: t("Entity Type Id"),
      field: "messageRule.entityTypeId"
    },
    {
      title: t("Entity Type"),
      field: "messageRule.entityType"
    },
    {
      title: t("Receiver Id"),
      field: "messageReceiver.receiverId"
    },
    {
      title: t("Receiver Type"),
      field: "messageReceiver.receiverType"
    },
    {
      title: t("External Id"),
      field: "messageReceiver.externalId"
    },
    {
      title: t("Delivery Status"),
      field: "deliveryStatus"
    },
    {
      title: t("Scheduled DateTime"),
      field: "scheduledDateTime",
      type: "date",
      render: row => formatDate(row.scheduledDateTime),
      defaultSort: "desc"
    },
    {
      title: t("Message Template Name"),
      field: "messageRule.name"
    },
    {
      title: t("Message Template Id"),
      field: "messageRule.messageTemplateId"
    }
  ];

  const renderNoMsgsYetToBeSent = () => (
    <Typography variant="caption" gutterBottom className={classes.infoMsg}>
      {" "}
      {t("No")} {t("messages")} {t("yet")} {t("to")} {t("be")} {t("sent")}
    </Typography>
  );

  const renderTable = () => (
    <MaterialTable
      title=""
      columns={columns}
      data={msgsYetToBeSent}
      options={{
        pageSize: 10,
        pageSizeOptions: [10, 15, 20],
        addRowPosition: "first",
        sorting: true,
        debounceInterval: 500,
        search: false,
        toolbar: false
      }}
    />
  );

  return isMsgsNotYetSentAvailable ? renderTable() : renderNoMsgsYetToBeSent();
};
export default YetToBeSentMessagesTable;