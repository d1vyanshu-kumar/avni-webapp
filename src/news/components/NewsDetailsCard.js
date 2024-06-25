import React, { Fragment } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { getFormattedDateTime } from "../../adminApp/components/AuditUtil";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { ActionButton } from "./ActionButton";
import { isNil } from "lodash";
import Divider from "@material-ui/core/Divider";
import { AvniImageUpload } from "../../common/components/AvniImageUpload";
import DOMPurify from "dompurify";
import { connect } from "react-redux";
import UserInfo from "../../common/model/UserInfo";
import { Privilege } from "openchs-models";

const NewsDetailsCard = ({ history, news, setDeleteAlert, setOpenEdit, setPublishAlert, displayActions, userInfo }) => {
  const canEditNews = UserInfo.hasPrivilege(userInfo, Privilege.PrivilegeType.EditNews);

  return (
    <Fragment>
      <Grid container direction="row" alignItems={"center"}>
        <Grid item container xs={6} direction={"column"}>
          <Grid item>
            <Button color="primary" onClick={history.goBack} style={{ textTransform: "none", backgroundColor: "transparent" }}>
              <Typography variant="h6" gutterBottom>
                {"< Back"}
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="h6" gutterBottom>
              {news.title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography style={{ opacity: 0.7 }} variant="body2">
              {getFormattedDateTime(news.createdDateTime)}
            </Typography>
          </Grid>
        </Grid>
        {displayActions && canEditNews && (
          <Grid item container justify={"flex-end"} spacing={2} xs={6}>
            <Grid item>
              <Button style={{ color: "red" }} onClick={() => setDeleteAlert(true)}>
                <DeleteIcon /> Delete
              </Button>
            </Grid>
            <Grid item>
              <Button color="primary" type="button" onClick={() => setOpenEdit(true)}>
                <EditIcon />
                Edit
              </Button>
            </Grid>
            <Grid item>
              <ActionButton
                disabled={!isNil(news.publishedDate)}
                onClick={() => setPublishAlert(true)}
                variant="contained"
                style={{ paddingHorizontal: 10 }}
                size="medium"
              >
                {"Publish this news"}
              </ActionButton>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Box mt={2} />
      <Divider />
      <Box mt={2} />
      <Grid container spacing={5} direction="column">
        <Grid item align={"center"}>
          <AvniImageUpload oldImgUrl={news.heroImage} height={"400"} width={"80%"} />
        </Grid>
        <Grid item container justify="flex-start">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.contentHtml) }} />
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  userInfo: state.app.userInfo
});

export default connect(mapStateToProps)(NewsDetailsCard);
