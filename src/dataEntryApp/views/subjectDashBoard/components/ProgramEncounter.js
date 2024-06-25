import React, { Fragment, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { isEqual } from "lodash";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withParams } from "common/components/utils";
import Breadcrumbs from "dataEntryApp/components/Breadcrumbs";
import {
  onLoad,
  updateProgramEncounter,
  editProgramEncounter,
  resetState,
  createProgramEncounter,
  createProgramEncounterForScheduled
} from "../../../reducers/programEncounterReducer";
import ProgramEncounterForm from "./ProgramEncounterForm";
import CustomizedBackdrop from "../../../components/CustomizedBackdrop";
import { fetchProgramEncounterRulesResponse, setEncounterDate } from "dataEntryApp/reducers/programEncounterReducer";
import { AbstractEncounter } from "openchs-models";
import StaticFormElement from "dataEntryApp/views/viewmodel/StaticFormElement";
import { DateFormElement } from "dataEntryApp/components/DateFormElement";
import { LineBreak } from "../../../../common/components/utils";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(1, 3),
    flexGrow: 1
  }
}));

const ProgramEncounter = ({ match, programEncounter, validationResults, setEncounterDate, ...props }) => {
  const classes = useStyles();
  const editProgramEncounter = isEqual(match.path, "/app/subject/editProgramEncounter");
  const encounterUuid = match.queryParams.encounterUuid;
  const enrolUuid = match.queryParams.enrolUuid;
  const uuid = match.queryParams.uuid;
  const { t } = useTranslation();
  useEffect(() => {
    props.resetState();
    if (editProgramEncounter) {
      props.editProgramEncounter(uuid);
    } else if (encounterUuid) {
      //encounterUuid - programEncounterUuid
      props.createProgramEncounterForScheduled(encounterUuid);
    } else {
      //uuid - encounterTypeUuid
      props.createProgramEncounter(uuid, enrolUuid);
    }
  }, []);

  return (
    <Fragment>
      <Breadcrumbs path={match.path} />
      <Paper className={classes.root}>
        <Grid justifyContent="center" alignItems="center" container spacing={3}>
          <Grid item xs={12}>
            {props.programEncounterForm && programEncounter && props.subjectProfile ? (
              <ProgramEncounterForm fetchRulesResponse={fetchProgramEncounterRulesResponse}>
                <DateFormElement
                  uuid={AbstractEncounter.fieldKeys.ENCOUNTER_DATE_TIME}
                  formElement={new StaticFormElement(t("visitDate"), true, true)}
                  value={programEncounter.encounterDateTime}
                  validationResults={validationResults}
                  update={setEncounterDate}
                />
                <LineBreak num={3} />
              </ProgramEncounterForm>
            ) : (
              <CustomizedBackdrop load={false} />
            )}
          </Grid>
        </Grid>
      </Paper>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  programEncounterForm: state.dataEntry.programEncounterReducer.programEncounterForm,
  subjectProfile: state.dataEntry.subjectProfile.subjectProfile,
  programEncounter: state.dataEntry.programEncounterReducer.programEncounter,
  validationResults: state.dataEntry.programEncounterReducer.validationResults
});

const mapDispatchToProps = {
  onLoad,
  updateProgramEncounter,
  editProgramEncounter,
  resetState,
  createProgramEncounter,
  createProgramEncounterForScheduled,
  setEncounterDate
};

export default withRouter(
  withParams(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ProgramEncounter)
  )
);
