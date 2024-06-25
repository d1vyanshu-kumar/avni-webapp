import React, { useEffect, useReducer } from "react";
import Box from "@material-ui/core/Box";
import { DocumentationContainer } from "../../../common/components/DocumentationContainer";
import { Title } from "react-admin";
import { get, map, find, isEmpty, differenceBy, includes, filter } from "lodash";
import http from "../../../common/utils/httpClient";
import { SearchFieldReducer } from "./SearchFieldReducer";
import SearchResultFieldState from "./SearchResultFieldState";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import commonApi from "../../../common/service";
import Select from "react-select";
import CustomizedBackdrop from "../../../dataEntryApp/components/CustomizedBackdrop";
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { SaveComponent } from "../../../common/components/SaveComponent";
import CustomizedSnackbar from "../CustomizedSnackbar";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import { DragNDropComponent } from "../../common/DragNDropComponent";
import UserInfo from "../../../common/model/UserInfo";
import { Privilege } from "openchs-models";
import { connect } from "react-redux";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const SearchResultFields = ({ userInfo }) => {
  const [state, dispatch] = useReducer(SearchFieldReducer, new SearchResultFieldState());
  const orgConfigKey = "searchResultFields";
  const { selectedSubjectTypeUUID, loadApp, subjectTypeMetadata, searchResultFields, feedbackMessage } = state;
  const selectedSubjectTypeMetadata = find(subjectTypeMetadata, ({ subjectType }) => subjectType.uuid === selectedSubjectTypeUUID);
  const selectedCustomFields = state.getFieldsForSelectedSubjectType();
  const allowedDataTypes = ["Numeric", "Text", "Coded", "Id", "Date"];
  const allConcepts = filter(get(selectedSubjectTypeMetadata, "concepts", []), ({ dataType }) => includes(allowedDataTypes, dataType));
  const possibleOptions = differenceBy(allConcepts, selectedCustomFields, "uuid");

  useEffect(() => {
    http
      .fetchJson("/web/subjectTypeMetadata")
      .then(response => response.json)
      .then(res => {
        dispatch({ type: "setMetadata", payload: res });
      });
  }, []);

  useEffect(() => {
    commonApi.fetchOrganisationConfigs().then(config => {
      dispatch({ type: "setData", payload: get(config, `organisationConfig.${orgConfigKey}`, []) });
    });
  }, []);

  const onSave = () => {
    const payload = { settings: { [orgConfigKey]: searchResultFields } };
    return http
      .put("/organisationConfig", payload)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: "saveOk" });
        }
      })
      .catch(error => {
        dispatch({ type: "saveError" });
        console.error(error);
      });
  };

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const searchResultConcepts = reorder(selectedCustomFields, result.source.index, result.destination.index);

    dispatch({ type: "changeOrder", payload: { searchResultConcepts } });
  };

  const renderSubjectTypes = () => (
    <FormControl component="fieldset">
      <FormLabel component="legend">{"Subject types"}</FormLabel>
      <RadioGroup row aria-label="position" name="position">
        <RadioGroup row aria-label="conjunction" value={selectedSubjectTypeUUID || ""}>
          {map(subjectTypeMetadata, ({ subjectType }) => (
            <FormControlLabel
              key={subjectType.uuid}
              control={<Radio color="primary" />}
              value={subjectType.uuid}
              label={subjectType.name}
              onChange={() =>
                dispatch({
                  type: "subjectTypeChange",
                  payload: { subjectTypeUUID: subjectType.uuid }
                })
              }
            />
          ))}
        </RadioGroup>
      </RadioGroup>
    </FormControl>
  );

  const renderCustomField = concept => {
    return (
      <List>
        <ListItem>
          <ListItemText primary={concept.name} />
          <ListItemSecondaryAction>
            <IconButton onClick={() => dispatch({ type: "deleteField", payload: { uuid: concept.uuid } })}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  };

  const renderDraggableFields = () => (
    <DragNDropComponent
      dataList={selectedCustomFields}
      onDragEnd={onDragEnd}
      renderOtherSummary={concept => renderCustomField(concept)}
      summaryDirection={"column"}
    />
  );

  const renderNotConfiguredMessage = () => (
    <Typography component={"div"} variant={"subtitle1"}>
      {"No fields configured for this subject type. Please select the fields from the dropdown."}
    </Typography>
  );

  return (
    <Box boxShadow={2} p={5} bgcolor="background.paper">
      <Title title="Search Result Fields" />
      <CustomizedBackdrop load={loadApp} />
      {loadApp && (
        <DocumentationContainer filename={"SearchResultFields.md"}>
          {renderSubjectTypes()}
          <Select
            placeholder="Select to add new custom search field"
            value={null}
            options={possibleOptions}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.uuid}
            style={{ width: "auto" }}
            onChange={concept => dispatch({ type: "addCustomField", payload: { concept } })}
          />
          <Box mt={3} mb={5}>
            <Typography component={"div"} variant={"h6"} gutterBottom>
              {"Custom search fields"}
            </Typography>
            {isEmpty(selectedCustomFields) ? renderNotConfiguredMessage() : renderDraggableFields()}
          </Box>
          {UserInfo.hasPrivilege(userInfo, Privilege.PrivilegeType.EditOfflineDashboardAndReportCard) && (
            <SaveComponent name="Save" onSubmit={onSave} />
          )}
        </DocumentationContainer>
      )}
      {!isEmpty(feedbackMessage) && (
        <CustomizedSnackbar
          message={feedbackMessage.message}
          variant={feedbackMessage.variant}
          getDefaultSnackbarStatus={() => dispatch({ type: "resetFeedback" })}
          defaultSnackbarStatus={!isEmpty(feedbackMessage)}
        />
      )}
    </Box>
  );
};

const mapStateToProps = state => ({
  userInfo: state.app.userInfo
});

export default connect(mapStateToProps)(SearchResultFields);
