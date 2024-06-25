import React, { Fragment } from "react";
import { Box, TextField, Typography } from "@material-ui/core";
import moment from "moment/moment";
import _ from "lodash";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useTranslation } from "react-i18next";
import { dateFormat } from "dataEntryApp/constants";
import { LineBreak } from "../../common/components/utils";

export const DateOfBirth = ({ dateOfBirth, onChange, dobErrorMsg }) => {
  const { t } = useTranslation();
  const [years, setYears] = React.useState(0);
  const [months, setMonths] = React.useState(0);
  const dob = (dateOfBirth && moment(dateOfBirth).isValid() && new Date(dateOfBirth)) || null;

  React.useEffect(() => {
    if (dateOfBirth) {
      setYears(moment().diff(dateOfBirth, "years"));
      setMonths(moment().diff(dateOfBirth, "months") % 12);
    } else {
      setYears("");
      setMonths("");
    }
  }, [dateOfBirth]);

  const _onYearsChange = value => {
    setYears(value);
    onChange(
      moment()
        .subtract(value, "years")
        .subtract(months, "months")
        .toDate()
    );
  };

  return (
    <Fragment>
      <Box display="flex" flexDirection="column">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Typography variant="body1" gutterBottom style={{ width: "50%", marginBottom: 5, color: "rgba(0, 0, 0, 0.54)" }}>
            {t("dateOfBirth")}
            {"*"}
          </Typography>
          <KeyboardDatePicker
            error={!_.isEmpty(dobErrorMsg)}
            helperText={t(dobErrorMsg)}
            required
            margin="normal"
            id="Date-of-Birth"
            autoComplete="off"
            placeholder={dateFormat}
            format={dateFormat}
            style={{ width: "30%" }}
            name="dateOfBirth"
            // label={t("date of birth")}
            value={_.isNil(dateOfBirth) ? null : dateOfBirth}
            onChange={date => onChange(date)}
            InputLabelProps={{
              shrink: true
            }}
            KeyboardButtonProps={{
              "aria-label": "change date",
              color: "primary"
            }}
          />
        </MuiPickersUtilsProvider>
        <LineBreak num={1} />
        <Typography variant="body1" gutterBottom style={{ width: "50%", color: "rgba(0, 0, 0, 0.54)" }}>
          {t("age")}
        </Typography>
        <TextField
          // label={t("age")}
          type={"numeric"}
          autoComplete="off"
          required
          name="ageYearsPart"
          value={_.isNaN(years) ? "" : years}
          style={{ width: "30%" }}
          // error={Boolean(_.isEmpty(dateOfBirth) && dobErrorMsg)}
          // helperText={_.isEmpty(dateOfBirth) && t(dobErrorMsg)}
          error={Boolean(_.isNil(dob) && dobErrorMsg)}
          helperText={_.isNil(dob) && dobErrorMsg && t("emptyValidationMessage")}
          onChange={e => _onYearsChange(e.target.value)}
        />
      </Box>
    </Fragment>
  );
};
