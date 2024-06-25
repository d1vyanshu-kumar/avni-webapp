import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import { InputLabel, makeStyles } from "@material-ui/core";
import { ToolTip } from "../common/components/ToolTip";
import React from "react";
import { dataTypeIcons, ExpansionPanel, ExpansionPanelSummary } from "./components/FormElement";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  iconlay: {
    paddingTop: "3px"
  },
  expandIcon: {
    paddingTop: "3px",
    paddingRight: "0px"
  },
  iconDataType: {
    padding: "10px"
  },
  questionCount: {
    paddingTop: "20px"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
    paddingTop: "10px"
  },
  secondaryHeading: {
    flexBasis: "70%",
    fontSize: theme.typography.pxToRem(15)
  },
  asterisk: {
    color: "red"
  }
}));

const StaticFormElement = ({ groupIndex, index, dataType, name, ...props }) => {
  const classes = useStyles();
  const panel = "panel" + groupIndex.toString + index.toString();

  return (
    <ExpansionPanel TransitionProps={{ mountOnEnter: false, unmountOnExit: false }} expanded={false} className={classes.root}>
      <ExpansionPanelSummary aria-controls={panel + "bh-content"} id={panel + "bh-header"}>
        <div className={classes.iconlay}>
          <Typography component={"div"} className={classes.secondaryHeading}>
            {["Date", "Numeric", "Text"].includes(dataType) && (
              <div className={classes.iconDataType}>
                <Tooltip title={dataType}>{dataTypeIcons[dataType]}</Tooltip>
              </div>
            )}
            {dataType === "Coded" && (
              <div className={classes.iconDataType}>
                <Tooltip title={dataType + " : SingleSelect"}>{dataTypeIcons["concept"]["SingleSelect"]}</Tooltip>
              </div>
            )}
          </Typography>
        </div>
        <Grid container sm={12} alignItems={"center"}>
          <Grid item sm={11} style={{ paddingTop: "10px" }}>
            <Typography component={"span"} className={classes.heading}>
              <InputLabel
                name={"name" + panel}
                style={{ display: "inline-block" }}
                required={true}
                classes={{ asterisk: classes.asterisk }}
              >
                {name}
              </InputLabel>
            </Typography>
          </Grid>
          <Grid item sm={1} direction={"row"}>
            <ToolTip toolTipKey={"APP_DESIGNER_FORM_ELEMENT_NAME"} onHover displayPosition={"bottom"} />
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
    </ExpansionPanel>
  );
};

export default StaticFormElement;
