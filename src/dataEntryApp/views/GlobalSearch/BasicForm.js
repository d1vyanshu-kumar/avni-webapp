import React, { Fragment } from "react";
import { TextField, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { find } from "lodash";
import AddressLevelsByType from "../../../common/components/AddressLevelsByType";

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

function BasicForm({
  searchFilterForms,
  onChange,
  genders,
  onGenderChange,
  selectedGender,
  enterValue,
  addressLevelIds,
  setAddressLevelIds
}) {
  const classes = useStyles();
  const { t } = useTranslation();

  function renderSearchAll(index, titleKey) {
    return (
      <Grid item key={index}>
        <Typography variant="body1" gutterBottom className={classes.lableStyle}>
          {t(titleKey)}
        </Typography>
        <TextField
          id={titleKey}
          key={index}
          autoComplete="off"
          name="searchAll"
          type="text"
          style={{ width: "100%" }}
          onChange={onChange}
          value={enterValue.searchAll}
        />
      </Grid>
    );
  }

  const isFilterConfigured = !!find(searchFilterForms, sff => sff.type);

  return isFilterConfigured ? (
    <Fragment>
      <Grid container spacing={3} className={classes.componentSpacing}>
        {searchFilterForms.map((searchFilterForm, index) =>
          searchFilterForm.type === "Name" ? (
            <Grid item key={index}>
              <Typography variant="body1" gutterBottom className={classes.lableStyle}>
                {t(searchFilterForm.titleKey)}
              </Typography>
              <TextField
                id={searchFilterForm.titleKey}
                key={index}
                name="name"
                autoComplete="off"
                type="text"
                style={{ width: "100%" }}
                onChange={onChange}
                value={enterValue.name}
              />
            </Grid>
          ) : (
            ""
          )
        )}

        {searchFilterForms.map((searchFilterForm, index) =>
          searchFilterForm.type === "Age" ? (
            <Grid item key={index}>
              <Typography variant="body1" gutterBottom className={classes.lableStyle}>
                {t(searchFilterForm.titleKey)}
              </Typography>
              <TextField
                id={searchFilterForm.titleKey}
                key={index}
                autoComplete="off"
                name="age"
                type="number"
                style={{ width: "100%" }}
                onChange={onChange}
                value={enterValue.age}
              />
            </Grid>
          ) : (
            ""
          )
        )}

        {searchFilterForms.map((searchFilterForm, index) =>
          searchFilterForm.type === "SearchAll" ? renderSearchAll(index, searchFilterForm.titleKey) : ""
        )}
      </Grid>
      <Grid container spacing={3} className={classes.componentSpacing}>
        {searchFilterForms.map((searchFilterForm, index) =>
          searchFilterForm.type === "Gender" ? (
            <Grid item xs={12} key={index}>
              <Typography variant="body1" gutterBottom className={classes.lableStyle}>
                {t(searchFilterForm.titleKey)}
              </Typography>
              <FormGroup row>
                {genders.map((gender, index) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedGender != null ? selectedGender[gender.uuid] : false}
                        onChange={onGenderChange}
                        name={gender.uuid}
                        color="primary"
                      />
                    }
                    label={t(gender.name)}
                    key={index}
                  />
                ))}
              </FormGroup>
            </Grid>
          ) : (
            ""
          )
        )}
      </Grid>

      <Grid container spacing={3} className={classes.componentSpacing}>
        {searchFilterForms.map((searchFilterForm, index) =>
          searchFilterForm.type === "Address" ? (
            <Grid item xs={12} key={index}>
              <AddressLevelsByType
                label={t(searchFilterForm.titleKey)}
                addressLevelsIds={addressLevelIds}
                setAddressLevelsIds={setAddressLevelIds}
              />
            </Grid>
          ) : (
            ""
          )
        )}
      </Grid>
    </Fragment>
  ) : (
    <Grid container spacing={3} className={classes.componentSpacing}>
      {renderSearchAll(1, "searchAll")}
    </Grid>
  );
}

BasicForm.defaultProps = {
  searchFilterForm: {}
};

export default BasicForm;
