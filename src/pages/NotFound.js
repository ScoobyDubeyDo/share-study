import { Typography, Grid, Avatar, CssBaseline } from "@mui/material";
import React from "react";
import photo from "../images/four0four.png";

function NotFound() {
    return (
        <Grid
            container
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-evenly"
            alignItems="center"
            spacing={3}
            sx={{ mt: 2 }}
        >
            <CssBaseline />
            <Grid item xs={12} md={5}>
                <Avatar
                    alt="404 page not found"
                    src={photo}
                    sx={{
                        width: {
                            xs: "80vw",
                            md: "40vw",
                        },
                        height: {
                            xs: "80vw",
                            md: "40vw",
                        },
                    }}
                />
            </Grid>
            <Grid item xs="auto" md={5}>
                <Typography
                    sx={{
                        fontSize: {
                            sm: "default",
                            md: 25,
                            xl: 45,
                        },
                    }}
                    gutterBottom
                    variant="h5"
                    component="div"
                >
                    This Page is a Ghost
                </Typography>
                <Typography
                    sx={{
                        fontSize: {
                            sm: "default",
                            md: 20,
                            xl: 35,
                        },
                    }}
                    color="text.secondary"
                >
                    Once alive and now dead, this ghost appears to have some
                    unfinished business. Could it be with you? Or the treasure
                    hidden under the floorboards of the old mansion in the hills
                    that may never reach its rightful owner, a compassionate
                    school teacher in Brooklyn.
                </Typography>
            </Grid>
        </Grid>
    );
}

export default NotFound;
