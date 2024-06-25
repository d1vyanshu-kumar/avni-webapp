import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import Colors from "../Colors";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  highlightBackground: {
    backgroundColor: Colors.HighlightBackgroundColor
  },
  tableContainer: {
    borderRadius: "3px",
    boxShadow: "0px 0px 1px"
  }
}));

const ScheduledVisitsTable = ({ visitSchedules }) => {
  const classes = useStyles();

  const { t } = useTranslation();
  return (
    <Table className={`${classes.tableContainer} ${classes.highlightBackground}`} aria-label="caption table">
      <TableHead>
        <TableRow>
          <TableCell align="left">{t("visitName")}</TableCell>
          <TableCell align="left">{t("schedulingFor")}</TableCell>
          <TableCell align="left">{t("overdueBy")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {visitSchedules.map(row => (
          <TableRow key={row.name}>
            <TableCell align="left" component="th" scope="row">
              {t(row.name)}
            </TableCell>
            <TableCell align="left">{moment(row.earliestDate).format("DD-MM-YYYY")}</TableCell>
            <TableCell align="left">{moment(row.maxDate).format("DD-MM-YYYY")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ScheduledVisitsTable;
