import React from "react";
import _, { get, isEqual } from "lodash";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Grid from "@material-ui/core/Grid";
import { Checkbox, FormControl, Input } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Draggable, Droppable } from "react-beautiful-dnd";

import FormElementWithAddButton from "./FormElementWithAddButton";
import GroupIcon from "@material-ui/icons/ViewList";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { FormElementGroupRule } from "./FormElementGroupRule";
import { ToolTip } from "../../common/components/ToolTip";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { ColourStyle } from "./ColourStyle";

const useStyles = makeStyles(theme => ({
  parent: {
    paddingLeft: 0,
    paddingBottom: 30
  },
  root: {
    width: "100%"
  },
  rootError: {
    width: "100%",
    border: "1px solid red"
  },
  iconlay: {
    flex: 1,
    alignItems: "center"
  },
  questionCount: {
    paddingTop: "5px"
  },

  absolute: {
    position: "absolute",
    marginLeft: -35,
    marginTop: -5
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    flexBasis: "70%",
    fontSize: theme.typography.pxToRem(15)
    //color: theme.palette.text.secondary,
  },
  tabs: {
    minHeight: "26px",
    height: "26px"
  },
  tab: {
    minHeight: "26px",
    height: "26px"
  }
}));
export const ExpansionPanel = withStyles({
  root: {
    "&$expanded": {
      margin: 0
    }
  },
  expanded: {}
})(MuiExpansionPanel);
export const ExpansionPanelSummary = withStyles({
  root: {
    paddingRight: 0,
    backgroundColor: "#dbdbdb",
    border: "1px solid #2196F3",
    paddingLeft: 0,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    },
    "&$focused": {
      backgroundColor: "#dbdbdb"
    }
  },
  focused: {},
  content: {
    margin: "0",
    "&$expanded": { margin: "0" }
  },
  expanded: {},
  icon: {
    marginHorizontal: "8px",
    display: "inline"
  }
})(MuiExpansionPanelSummary);

function FormElementGroup(props) {
  const classes = useStyles();
  const [hover, setHover] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const panel = "panel" + props.index.toString();
  let questionCount = 0;
  const eventCall = (index, key, value) => {
    props.handleGroupElementChange(index, key, value);
    props.handleGroupElementChange(index, "display", value);
  };

  _.forEach(props.groupData.formElements, (element, index) => {
    if (!element.voided) {
      questionCount = questionCount + 1;
    }
  });

  const handleDelete = event => {
    props.deleteGroup(props.index);
    event.stopPropagation();
    //props.deleteRecord(props.index);
  };

  const separateAddGroup = event => {
    props.btnGroupAdd(props.index);
  };

  const separateAddElement = event => {
    props.btnGroupAdd(props.index, 0);
  };
  const stopPropagation = e => e.stopPropagation();

  //Display/Hide Add Group button
  const hoverDisplayAddGroup = event => {
    setHover(true);
    setDragGroup(true);
  };

  const hoverHideAddGroup = event => {
    setHover(false);
    setDragGroup(false);
  };

  const renderFormElements = () => {
    const formElements = [];
    const displayOrderFormElements = props.groupData.formElements;

    _.forEach(displayOrderFormElements, (formElement, index) => {
      if (!formElement.voided && _.isNil(formElement.parentFormElementUuid)) {
        let propsElement = {
          key: "Element" + props.index + "" + index,
          formElementData: formElement,
          groupIndex: props.index,
          index: index,
          btnGroupAdd: props.btnGroupAdd,
          identifierSources: props.identifierSources,
          groupSubjectTypes: props.groupSubjectTypes,
          handleGroupElementChange: props.handleGroupElementChange,
          deleteGroup: props.deleteGroup,
          updateConceptElementData: props.updateConceptElementData,
          handleGroupElementKeyValueChange: props.handleGroupElementKeyValueChange,
          handleExcludedAnswers: props.handleExcludedAnswers,
          updateSkipLogicRule: props.updateSkipLogicRule,
          updateSkipLogicJSON: props.updateSkipLogicJSON,
          handleModeForDate: props.handleModeForDate,
          handleRegex: props.handleRegex,
          handleConceptFormLibrary: props.handleConceptFormLibrary,
          availableDataTypes: props.availableDataTypes,
          onSaveInlineConcept: props.onSaveInlineConcept,
          handleInlineNumericAttributes: props.handleInlineNumericAttributes,
          handleInlineCodedConceptAnswers: props.handleInlineCodedConceptAnswers,
          onToggleInlineConceptCodedAnswerAttribute: props.onToggleInlineConceptCodedAnswerAttribute,
          onDeleteInlineConceptCodedAnswerDelete: props.onDeleteInlineConceptCodedAnswerDelete,
          onMoveUp: props.onMoveUp,
          onMoveDown: props.onMoveDown,
          onAlphabeticalSort: props.onAlphabeticalSort,
          handleInlineCodedAnswerAddition: props.handleInlineCodedAnswerAddition,
          handleInlineLocationAttributes: props.handleInlineLocationAttributes,
          handleInlineSubjectAttributes: props.handleInlineSubjectAttributes,
          handleInlinePhoneNumberAttributes: props.handleInlinePhoneNumberAttributes,
          entityName: props.entityName,
          disableFormElement: props.disableGroup,
          subjectType: props.subjectType,
          form: props.form,
          handleInlineEncounterAttributes: props.handleInlineEncounterAttributes
        };
        formElements.push(
          <Draggable
            key={"Element" + props.index + "" + index}
            draggableId={"Group" + props.index + "Element" + index}
            index={index}
            isDragDisabled={props.disableGroup}
          >
            {provided => (
              <div {...provided.draggableProps} ref={provided.innerRef}>
                <FormElementWithAddButton {...propsElement} dragHandleProps={provided.dragHandleProps} />
              </div>
            )}
          </Draggable>
        );
      }
    });
    return formElements;
  };

  const [dragGroup, setDragGroup] = React.useState(false);
  const disableGroup = props.disableGroup;

  const DragHandler = props => (
    <div style={{ height: 5 }} {...props}>
      <div hidden={!dragGroup || disableGroup}>
        <DragHandleIcon color={"disabled"} />
      </div>
    </div>
  );

  return (
    <Draggable key={"Element" + props.index} draggableId={"Element" + props.index} index={props.index} isDragDisabled={disableGroup}>
      {provided => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={classes.parent}
          onMouseEnter={hoverDisplayAddGroup}
          onMouseLeave={hoverHideAddGroup}
        >
          <Grid item>
            <ExpansionPanel
              TransitionProps={{ mountOnEnter: true, unmountOnExit: true }}
              expanded={props.groupData.expanded}
              className={props.groupData.error ? classes.rootError : classes.root}
              onChange={event => props.handleGroupElementChange(props.index, "expanded", !props.groupData.expanded)}
            >
              <ExpansionPanelSummary aria-controls={panel + "bh-content"} id={panel + "bh-header"} {...provided.dragHandleProps}>
                <Grid container direction={"row"}>
                  <Grid container item alignItems={"center"} justify={"center"}>
                    <DragHandler />
                  </Grid>
                  <Grid container item sm={12} alignItems={"center"}>
                    <Grid item sm={1}>
                      <Tooltip title={"Grouped Questions"}>
                        <GroupIcon style={{ marginLeft: 12, marginRight: 4 }} />
                      </Tooltip>
                      {props.groupData.expanded ? (
                        <ExpandLessIcon classes={{ root: classes.icon }} />
                      ) : (
                        <ExpandMoreIcon classes={{ root: classes.icon }} />
                      )}
                    </Grid>
                    <Grid item sm={6}>
                      <Typography className={classes.heading}>
                        {props.groupData.errorMessage && props.groupData.errorMessage.name && (
                          <div style={{ color: "red" }}>Please enter Page name.</div>
                        )}
                        {get(props.groupData, "errorMessage.ruleError") && (
                          <div style={{ color: "red" }}>Please check the rule validation errors</div>
                        )}
                        <FormControl fullWidth>
                          <Input
                            type="text"
                            placeholder="Page name"
                            name={"name" + panel}
                            disableUnderline={true}
                            onClick={stopPropagation}
                            value={props.groupData.name}
                            onChange={event => eventCall(props.index, "name", event.target.value)}
                            autoComplete="off"
                            disabled={disableGroup}
                          />
                        </FormControl>
                      </Typography>
                    </Grid>
                    {props.groupData.timed && (
                      <Grid item sm={3}>
                        <Grid item container direction={"row"}>
                          <Grid item sm={6}>
                            <TextField
                              type="number"
                              label="Start time (Seconds)"
                              value={props.groupData.startTime}
                              InputProps={{ disableUnderline: true }}
                              onClick={stopPropagation}
                              onChange={event => props.handleGroupElementChange(props.index, "startTime", event.target.value)}
                              autoComplete="off"
                              disabled={disableGroup}
                            />
                          </Grid>
                          <Grid item sm={6}>
                            <TextField
                              type="number"
                              label="Stay time (Seconds)"
                              value={props.groupData.stayTime}
                              InputProps={{ disableUnderline: true }}
                              onClick={stopPropagation}
                              onChange={event => props.handleGroupElementChange(props.index, "stayTime", event.target.value)}
                              autoComplete="off"
                              disabled={disableGroup}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    <Grid item sm={props.groupData.timed ? 1 : 3}>
                      <Typography component={"div"} className={classes.questionCount}>
                        {questionCount} questions
                      </Typography>
                    </Grid>
                    <Grid item sm={1}>
                      <IconButton aria-label="delete" onClick={handleDelete} disabled={disableGroup}>
                        <DeleteIcon />
                      </IconButton>
                      <ToolTip toolTipKey={"APP_DESIGNER_FORM_ELEMENT_GROUP_NAME"} onHover displayPosition={"bottom"} />
                    </Grid>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <MuiExpansionPanelDetails style={{ padding: 0, paddingLeft: 0, paddingRight: 0 }}>
                <Grid direction={"column"} style={{ width: "100%" }}>
                  <Tabs
                    style={{
                      background: "#2196f3",
                      color: "white",
                      width: "100%",
                      marginBottom: 24,
                      height: 40
                    }}
                    classes={{ root: classes.tabs }}
                    value={tabIndex}
                    onChange={(event, value) => setTabIndex(value)}
                  >
                    <Tab label="Details" classes={{ root: classes.tab }} />
                    <Tab label="Rules" classes={{ root: classes.tab }} />
                  </Tabs>
                  <Grid hidden={tabIndex !== 0} style={{ width: "100%", alignContent: "center", marginBottom: 8 }}>
                    <Typography component={"span"} className={classes.root}>
                      <Droppable droppableId={"Group" + props.index} type="task">
                        {provided => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {renderFormElements()}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {questionCount === 0 && (
                        <FormControl fullWidth>
                          <Button variant="contained" color="secondary" onClick={separateAddElement} disabled={disableGroup}>
                            Add Question
                          </Button>
                        </FormControl>
                      )}
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ flex: 0.2 }}>
                          <FormControlLabel
                            style={{ marginLeft: 10 }}
                            control={
                              <Checkbox
                                id="isTimed"
                                checked={props.groupData.timed}
                                onChange={event => props.handleGroupElementChange(props.index, "timed", event.target.checked)}
                              />
                            }
                            label="Timed Page"
                          />
                        </div>
                        <div style={{ flex: 0.2 }}>
                          <ColourStyle
                            label={"Text colour"}
                            colour={props.groupData.textColour}
                            onChange={colour => props.handleGroupElementChange(props.index, "textColour", colour)}
                            toolTipKey={"APP_DESIGNER_GROUP_TEXT_COLOUR"}
                          />
                        </div>
                        <div style={{ flex: 0.2 }}>
                          <ColourStyle
                            label={"Background colour"}
                            colour={props.groupData.backgroundColour}
                            onChange={colour => props.handleGroupElementChange(props.index, "backgroundColour", colour)}
                            toolTipKey={"APP_DESIGNER_GROUP_BACKGROUND_COLOUR"}
                          />
                        </div>
                      </div>
                    </Typography>
                  </Grid>
                  <Grid hidden={tabIndex !== 1}>
                    <FormElementGroupRule groupData={props.groupData} disable={disableGroup} {...props} />
                  </Grid>
                </Grid>
              </MuiExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          {hover && (
            <Fab
              color="primary"
              aria-label="add"
              onClick={separateAddGroup}
              className={classes.absolute}
              size="small"
              disabled={disableGroup}
            >
              <AddIcon />
            </Fab>
          )}
        </div>
      )}
    </Draggable>
  );
}

function areEqual(prevProps, nextProps) {
  return isEqual(prevProps, nextProps);
}

export default React.memo(FormElementGroup, areEqual);
