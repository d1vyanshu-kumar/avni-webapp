import { connect } from "react-redux";
import { getUploadStatuses } from "./reducers";
import { withRouter } from "react-router-dom";
import React from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { find, get, isNil, map } from "lodash";
import moment from "moment";
import http from "common/utils/httpClient";
import fileDownload from "js-file-download";
import Box from "@material-ui/core/Box";
import { Grid } from "@material-ui/core";
import Refresh from "@material-ui/icons/Refresh";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import CloudDownload from "@material-ui/icons/CloudDownload";

const JobStatus = ({
  exportJobStatuses,
  getUploadStatuses,
  operationalModules: { subjectTypes, programs, encounterTypes }
}) => {
  React.useEffect(() => {
    getUploadStatuses(0);
  }, []);

  const rowsPerPage = 10;
  const [page, setPage] = React.useState(0);

  const formatDate = date => (isNil(date) ? date : moment(date).format("YYYY-MM-DD HH:mm"));
  const IsoDateFormat = date => (isNil(date) ? date : moment(date).format("YYYY-MM-DD"));
  const getDateParams = ({ startDate, endDate }) =>
    isNil(startDate) || isNil(endDate)
      ? ""
      : `${IsoDateFormat(startDate)} to ${IsoDateFormat(endDate)}`;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getUploadStatuses(newPage);
  };

  const findEntityByUUID = (entities, statusEntityTypeUUID) =>
    find(entities, ({ uuid }) => uuid === statusEntityTypeUUID) || {};

  const onDownloadHandler = ({
    fileName,
    subjectTypeUUID,
    programUUID,
    encounterTypeUUID,
    startDate,
    endDate
  }) => {
    const outFileName = [
      findEntityByUUID(subjectTypes, subjectTypeUUID).name,
      findEntityByUUID(programs, programUUID).operationalProgramName,
      findEntityByUUID(encounterTypes, encounterTypeUUID).operationalEncounterTypeName,
      IsoDateFormat(startDate),
      IsoDateFormat(endDate)
    ]
      .filter(Boolean)
      .join("_");
    http
      .get(`/export/download?fileName=${fileName}`, {
        responseType: "blob"
      })
      .then(response => {
        fileDownload(response.data, `${outFileName}.csv`);
      })
      .catch(error => alert("Error occurred while downloading file"));
  };

  return (
    <Box>
      <Grid container direction="row" justify="flex-end">
        <Button color="primary" onClick={() => getUploadStatuses(0)}>
          <Refresh />
          {" Refresh"}
        </Button>
      </Grid>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>Report Type</TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>Subject type</TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>Program</TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>Encounter type</TableCell>
            <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>Date range</TableCell>
            <TableCell align="right" style={{ minWidth: 180, fontWeight: "bold", fontSize: 17 }}>
              Ended at
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold", fontSize: 17 }}>
              Status
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold", fontSize: 17 }}>
              Download
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(get(exportJobStatuses, "content"), status => (
            <TableRow key={status.uuid}>
              <TableCell>{status.reportType}</TableCell>
              <TableCell>{findEntityByUUID(subjectTypes, status.subjectTypeUUID).name}</TableCell>
              <TableCell>
                {findEntityByUUID(programs, status.programUUID).operationalProgramName}
              </TableCell>
              <TableCell>
                {
                  findEntityByUUID(encounterTypes, status.encounterTypeUUID)
                    .operationalEncounterTypeName
                }
              </TableCell>
              <TableCell>{getDateParams(status)}</TableCell>
              <TableCell align="right">{formatDate(status.endTime)}</TableCell>
              <TableCell align="right">{status.status}</TableCell>
              <TableCell align="right">
                <Button
                  color="primary"
                  onClick={() => onDownloadHandler(status)}
                  disabled={status.status !== "COMPLETED"}
                >
                  <CloudDownload disabled={status.status !== "COMPLETED"} />
                  {" Download"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={get(exportJobStatuses, "totalElements") || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{ "aria-label": "previous page" }}
        nextIconButtonProps={{ "aria-label": "next page" }}
        onChangePage={handleChangePage}
      />
    </Box>
  );
};

const mapStateToProps = state => ({
  exportJobStatuses: state.reports.exportJobStatuses
});

export default withRouter(
  connect(
    mapStateToProps,
    { getUploadStatuses }
  )(JobStatus)
);
