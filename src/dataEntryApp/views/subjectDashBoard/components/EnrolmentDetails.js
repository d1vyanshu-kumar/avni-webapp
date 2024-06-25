import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import { DeleteButton } from "../../../components/DeleteButton";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import React, { Fragment } from "react";
import Observations from "../../../components/Observations";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  expansionPanel: {
    marginBottom: "11px",
    borderRadius: "5px",
    boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.4), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)"
  },
  expansionHeading: {
    fontSize: theme.typography.pxToRem(16),
    flexBasis: "33.33%",
    flexShrink: 0,
    fontWeight: "500"
  },
  expandMoreIcon: {
    color: "#0e6eff"
  }
}));

export const EnrolmentDetails = ({
  t,
  isExit,
  label,
  programData,
  programEnrolmentForm,
  subjectUuid,
  subjectProfile,
  undoExitEnrolment,
  handleUpdateComponent,
  setVoidConfirmation
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const getURLOfFormType = formType =>
    `/app/subject/enrol?uuid=${subjectUuid}&programName=${
      programData.program.operationalProgramName
    }&formType=${formType}&programEnrolmentUuid=${programData.uuid}&subjectTypeName=${subjectProfile.subjectType.name}`;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUndoExit = (programEnrolmentUuid, Link) => {
    undoExitEnrolment(programEnrolmentUuid);
    handleClose();
    handleUpdateComponent(subjectUuid);
  };

  const getExitInfo = () => {
    return [
      {
        label: "Exit Enrolment Date",
        value: moment(programData.programExitDateTime).format("DD-MMM-YYYY")
      }
    ];
  };

  const getEnrolmentInfo = () => {
    return [
      {
        label: "Enrolment Date",
        value: moment(programData.enrolmentDateTime).format("DD-MMM-YYYY")
      }
    ];
  };

  const renderObservations = () => {
    const obs = isExit ? programData.exitObservations : programData.observations;
    const additionalRows = isExit ? getExitInfo() : getEnrolmentInfo();
    return <Observations observations={obs} additionalRows={additionalRows} form={programEnrolmentForm} />;
  };

  const ActionButton = ({ to, label, id }) => {
    return (
      <Link to={to}>
        <Button id={id} color="primary">
          {t(label)}
        </Button>
      </Link>
    );
  };

  return (
    <ExpansionPanel className={classes.expansionPanel}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon className={classes.expandMoreIcon} />} id="enrolment-details">
        <Typography component={"span"} className={classes.expansionHeading}>
          {t(label)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ paddingTop: "0px" }}>
        <Grid item xs={12}>
          {renderObservations()}
          {!isExit ? (
            <Fragment>
              <ActionButton to={getURLOfFormType("ProgramExit")} label={"Exit"} id={"exit-program"} />
              <ActionButton to={getURLOfFormType("ProgramEnrolment")} label={"Edit"} id={"edit-program"} />
            </Fragment>
          ) : (
            <Fragment>
              <ActionButton to={getURLOfFormType("ProgramExit")} label={"Edit Exit"} id={"edit-exit"} />
              <Button id={"undo-exit"} color="primary" onClick={handleClickOpen}>
                {t("Undo Exit")}
              </Button>
            </Fragment>
          )}
          {!isExit && <DeleteButton onDelete={() => setVoidConfirmation(true)} />}
        </Grid>
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Undo Exit"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to undo exit and restore to enrolled state shows up
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleUndoExit.bind(this, programData.uuid, `/app/subject?uuid=${subjectUuid}&undo=true`)}
              color="primary"
              autoFocus
            >
              Undo Exit
            </Button>
          </DialogActions>
        </Dialog>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
