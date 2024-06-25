import React, { Fragment } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import _ from "lodash";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  lableStyle: {
    marginBottom: 10,
    color: "rgba(0, 0, 0, 0.54)"
  },
  componentSpacing: {
    marginTop: "1%",
    marginBottom: "1%"
  }
}));

function CodedConceptForm({ searchFilterForms, onChange, conceptList, selectedConcepts }) {
  const classes = useStyles();
  const { t } = useTranslation();
  return searchFilterForms ? (
    <Fragment key={searchFilterForms.uuid}>
      <Grid container spacing={3} className={classes.componentSpacing}>
        {searchFilterForms.map((searchFilterForm, index) => {
          const selectedValue = _.head(selectedConcepts.filter(c => c.conceptUUID === searchFilterForm.conceptUUID));
          let selected = {};
          selectedValue && _.forEach(selectedValue.values, sv => _.assign(selected, { [sv]: true }));
          return searchFilterForm.type === "Concept" && searchFilterForm.conceptDataType === "Coded" ? (
            <Grid item xs={12} key={index}>
              <Typography variant="body1" gutterBottom className={classes.lableStyle}>
                {t(searchFilterForm.titleKey)}
              </Typography>
              <FormGroup row key={index}>
                {conceptList.map((concept, index) =>
                  concept.uuid === searchFilterForm.conceptUUID
                    ? concept.conceptAnswers.map((conceptAnswer, index) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selected != null ? selected[conceptAnswer.answerConcept.uuid] : false}
                              onChange={event => onChange(event, searchFilterForm)}
                              name={conceptAnswer.answerConcept.uuid}
                              color="primary"
                            />
                          }
                          label={t(conceptAnswer.answerConcept.name)}
                          key={index}
                        />
                      ))
                    : ""
                )}
              </FormGroup>
            </Grid>
          ) : (
            ""
          );
        })}
      </Grid>
    </Fragment>
  ) : (
    <div />
  );
}

CodedConceptForm.defaultProps = {
  searchFilterForm: {}
};
export default CodedConceptForm;
