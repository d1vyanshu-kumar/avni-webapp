import React, { useEffect, useReducer, useState } from "react";
import { Redirect } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { Title } from "react-admin";
import Button from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import { SaveComponent } from "../../common/components/SaveComponent";
import ApplicationMenuReducer from "../Reducers/ApplicationMenuReducer";
import EntityEditUtil from "../Util/EntityEditUtil";
import ApplicationMenuEditFields from "./ApplicationMenuEditFields";
import ApplicationMenuService from "../service/ApplicationMenuService";
import _ from "lodash";
import FormLabel from "@material-ui/core/FormLabel";

const ApplicationMenuEdit = props => {
  const [state, dispatch] = useReducer(ApplicationMenuReducer.execute, ApplicationMenuReducer.createApplicationMenuInitialState());
  const [redirectShow, setRedirectShow] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  function isCreate() {
    return _.isEmpty(props.match.params.id);
  }

  useEffect(() => {
    if (!isCreate())
      ApplicationMenuService.getMenuItem(props.match.params.id).then(menuItem =>
        dispatch({ type: ApplicationMenuReducer.INITIAL_MENU_ITEM, payload: menuItem })
      );
  }, []);

  const onSubmit = () => {
    dispatch({
      type: ApplicationMenuReducer.SUBMITTED,
      payload: {
        cb: () => {
          const savePromise = isCreate() ? ApplicationMenuService.post(state.menuItem) : ApplicationMenuService.put(state.menuItem);
          savePromise
            .then(response => {
              if (response.status === 200) {
                dispatch({ type: ApplicationMenuReducer.SAVED });
              }
            })
            .catch(error => dispatch({ type: ApplicationMenuReducer.SAVE_FAILED, payload: error }));
        }
      }
    });
  };

  return (
    <>
      <Box boxShadow={2} p={3} bgcolor="background.paper">
        <Title title={`${isCreate() ? "Create" : "Edit"} application menu}`} />
        {!isCreate() && (
          <Grid container item={12} style={{ justifyContent: "flex-end" }}>
            <Button color="primary" type="button" onClick={() => setRedirectShow(true)}>
              <VisibilityIcon /> Show
            </Button>
          </Grid>
        )}
        <div className="container" style={{ float: "left" }}>
          <ApplicationMenuEditFields menuItem={state.menuItem} dispatch={dispatch} errors={state.errors} />
          <p />
        </div>
        {state.errors.size > 0 &&
          Array.from(state.errors.values()).map(error => (
            <div>
              <FormLabel error style={{ marginTop: "10px", fontSize: "14px", marginLeft: "14px" }}>
                {error}
              </FormLabel>
              <br />
            </div>
          ))}
        <p />
        <Grid container item sm={12}>
          <Grid item sm={1}>
            <SaveComponent name="save" onSubmit={onSubmit} styleClass={{ marginLeft: "14px" }} />
          </Grid>
          {!isCreate() && (
            <Grid item sm={11}>
              <Button
                style={{
                  float: "right",
                  color: "red"
                }}
                onClick={() => EntityEditUtil.onDelete("menuItem", props.match.params.id, "application menu", () => setDeleteAlert(true))}
              >
                <DeleteIcon /> Delete
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
      {(redirectShow || state.saved) && (
        <Redirect to={isCreate() ? "/appDesigner/applicationMenu" : `/appDesigner/applicationMenu/${props.match.params.id}/show`} />
      )}
      {deleteAlert && <Redirect to="/appDesigner/applicationMenu" />}
    </>
  );
};

export default ApplicationMenuEdit;
