import { Box, Grid } from "@material-ui/core";
import React from "react";
import Typography from "@material-ui/core/Typography";

const Header = () => {
  return (
    <Box pb={3}>
      <Grid container direction={"column"} alignItems={"center"} spacing={1}>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Typography variant="h3" align={"center"}>
            We are here to help!
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Typography variant="body2" align={"center"}>
            While you can always email support@avni.freshdesk.com, you can also search our help articles, check out our YouTube channel, or
            schedule time with our product experts for you and your team.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
