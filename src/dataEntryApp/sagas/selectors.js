import { filter, find, get, isNil, some, head } from "lodash";

export const selectSubjectTypeFromName = subjectTypeName => state =>
  find(get(state, "dataEntry.metadata.operationalModules.subjectTypes"), subjectType => subjectType.name === subjectTypeName);
//it is returning another funciton
export const selectRegistrationFormMapping = subjectType => state =>
  find(
    //get takes state from store you can print this
    get(state, "dataEntry.metadata.operationalModules.formMappings"),
    fm => isNil(fm.programUUID) && isNil(fm.encounterTypeUUID) && fm.subjectTypeUUID === subjectType.uuid
  );

export const selectRegistrationFormMappingForSubjectType = subjectTypeName => state =>
  selectRegistrationFormMapping(selectSubjectTypeFromName(subjectTypeName)(state))(state);

export const selectRegistrationSubject = state => get(state, "dataEntry.registration.subject");

export const selectRegistrationProfilePictureFile = state => get(state, "dataEntry.registration.profilePictureFile");

export const selectRegistrationRemoveProfilePicture = state => get(state, "dataEntry.registration.removeProfilePicture");

export const selectSubjectProfile = state => get(state, "dataEntry.subjectProfile.subjectProfile");

export const selectsSubjectProgram = state => get(state, "dataEntry.subjectProgram.subjectProgram");

export const selectProgramEncounterTypes = (subjectTypeUuid, programUuid) => state => {
  const formMappings = filter(
    get(state, "dataEntry.metadata.operationalModules.formMappings"),
    fm => fm.subjectTypeUUID === subjectTypeUuid && fm.programUUID === programUuid && fm.formType === "ProgramEncounter"
  );

  const encounterTypes = filter(get(state, "dataEntry.metadata.operationalModules.encounterTypes"), encounterType =>
    some(formMappings, fm => fm.encounterTypeUUID === encounterType.uuid)
  );

  return encounterTypes;
};

export const selectGeneralEncounterTypes = subjectTypeUuid => state => {
  const formMappings = filter(
    get(state, "dataEntry.metadata.operationalModules.formMappings"),
    fm => fm.subjectTypeUUID === subjectTypeUuid && fm.formType === "Encounter"
  );

  const encounterTypes = filter(get(state, "dataEntry.metadata.operationalModules.encounterTypes"), encounterType =>
    some(formMappings, fm => fm.encounterTypeUUID === encounterType.uuid)
  );

  return encounterTypes;
};

export const selectOperationalModules = state => get(state, "dataEntry.metadata.operationalModules");

export const selectOrganisationConfig = state => {
  const orgConfigs = get(state, "translationsReducer.orgConfig._embedded.organisationConfig");
  return head(orgConfigs);
};
