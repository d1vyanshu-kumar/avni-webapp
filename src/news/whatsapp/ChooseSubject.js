import _ from "lodash";
import { SearchForm } from "../../dataEntryApp/views/GlobalSearch/SearchFilterForm";
import { LinearProgress } from "@material-ui/core";
import ErrorMessage from "../../common/components/ErrorMessage";
import Box from "@material-ui/core/Box";
import React, { useEffect, useState } from "react";
import SubjectSearchService from "../../dataEntryApp/services/SubjectSearchService";
import { connect, useDispatch } from "react-redux";
import { getGenders, getOperationalModules, getOrganisationConfig } from "../reducers/metadataReducer";
import { withRouter } from "react-router-dom";
import SelectSubject from "../../common/components/subject/SelectSubject";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";

const searchSubject = function(setWorkflowState, searchRequest, setSubjects) {
  setWorkflowState(WorkflowStates.Searching);
  return SubjectSearchService.search(searchRequest).then(subjects => {
    setSubjects(subjects["listOfRecords"]);
    setWorkflowState(WorkflowStates.SearchCompleted);
  });
};

const WorkflowStates = {
  Start: "Start",
  Searching: "Searching",
  SearchError: "SearchError",
  SearchCompleted: "SearchCompleted"
};

const SelectSubjectAndConfirm = function({ subjects, onSubjectChosen, onCancel, confirmLabel }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { t } = useTranslation();
  return (
    <Box style={{ flexDirection: "column", display: "flex" }}>
      <SelectSubject t={t} subjectData={subjects} onSelectedItem={setSelectedSubject} errormsg={null} />
      <Box style={{ flexDirection: "row-reverse", display: "flex", marginTop: 20 }}>
        <Button variant="outlined" color="secondary" onClick={() => onCancel()} style={{ marginLeft: 15 }}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" disabled={_.isNil(selectedSubject)} onClick={() => onSubjectChosen(selectedSubject)}>
          {confirmLabel}
        </Button>
      </Box>
    </Box>
  );
};

function ChooseSubject({ operationalModules, genders, organisationConfig, onSubjectChosen, onCancel, busy, confirmActionLabel }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOperationalModules());
    dispatch(getOrganisationConfig());
    dispatch(getGenders());
  }, []);

  const [subjects, setSubjects] = useState(null);
  const [error, setError] = useState(null);
  const [workflowState, setWorkflowState] = useState(WorkflowStates.Start);

  const loading = !(operationalModules && genders && organisationConfig);

  const displayProgress = loading || _.includes([WorkflowStates.Searching], workflowState) || busy;
  const displaySelectSubject = !loading && _.includes([WorkflowStates.SearchCompleted], workflowState);
  const displayError = _.includes([WorkflowStates.SearchError], workflowState);

  return (
    <Box style={{ padding: 20 }}>
      {!loading && _.includes([WorkflowStates.Start, WorkflowStates.Searching, WorkflowStates.SearchError], workflowState) && (
        <SearchForm
          operationalModules={operationalModules}
          genders={genders}
          organisationConfigs={organisationConfig}
          searchRequest={{ includeVoided: false }}
          onSearch={searchRequest =>
            searchSubject(setWorkflowState, searchRequest, setSubjects).catch(error => {
              setWorkflowState(WorkflowStates.SearchError);
              setError(error);
            })
          }
        />
      )}
      {displayProgress && <LinearProgress />}
      {displayError && <ErrorMessage error={error} />}
      {displaySelectSubject && (
        <SelectSubjectAndConfirm
          confirmLabel={confirmActionLabel}
          subjects={subjects}
          onSubjectChosen={subject => onSubjectChosen(subject)}
          onCancel={() => {
            setSubjects(null);
            onCancel();
            setWorkflowState(WorkflowStates.Start);
          }}
        />
      )}
    </Box>
  );
}

const mapStateToProps = state => ({
  operationalModules: state.broadcast.operationalModules,
  genders: state.broadcast.genders,
  organisationConfig: state.broadcast.organisationConfig
});

export default withRouter(connect(mapStateToProps)(ChooseSubject));
