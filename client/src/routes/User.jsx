import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUser } from "../../../server/firebase";
import {
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
  getDefault,
  getExistingCalendars,
  getSpecificCalendar,
  deleteSpecificCalendar,
} from "../../../server/utils";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCalendarID, setInitialState } from "../features/calendarSlice";
import { set } from "date-fns";

function User({ setPreviewClicked, previewClicked }) {
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [calendars, setCalendars] = useState([]);
  const [loadingCalendars, setLoadingCalendars] = useState(true);

  console.log("calendars", calendars);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  //navigation only happens after the data has been fetched
  const handleClick = async () => {
    await getDefault(dispatch);
    dispatch(setCalendarID(Date.now()));
    navigateTo("/editor");
    setPreviewClicked(false);
  };

  useEffect(() => {
    if (user) {
      const userID = user.uid;
      getExistingCalendars(userID)
        .then((fetchedCalendars) => {
          setCalendars(fetchedCalendars);
          setLoadingCalendars(false);
        })
        .catch((error) => {
          console.error("Error fetching calendars: ", error);
          setLoadingCalendars(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchUser = async () => {
        const userData = await getUser(user.uid);
        setUsername(userData.name);
      };
      fetchUser();
    }
  }, [user]);

  const handlePreviewEditClick = async (id) => {
    const calendarData = await getSpecificCalendar(id);
    if (calendarData) {
      dispatch(setInitialState(calendarData));
    }
  };

  const handleDeleteCalendar = async (id) => {
    await deleteSpecificCalendar(id);
    getExistingCalendars(user.uid)
      .then((fetchedCalendars) => {
        setCalendars(fetchedCalendars);
      })
      .catch((error) => {
        console.error("Error fetching calendars: ", error);
      });
  };

  // if user is not logged in, redirect to login page
  if (user === null) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ overflowY: "auto" }}>
      <Box
        className="user-dashboard"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 68.5px - 46px)",
          justifyContent: "center",
        }}>
        {loadingCalendars ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}>
            <CircularProgress sx={{ color: "#476C92" }} />
            <Typography variant="h5" sx={{ color: "#476C92" }}>
              Loading calendars...
            </Typography>
          </Box>
        ) : calendars.length > 0 ? (
          <>
            <Typography
              component="h2"
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#476C92",
                mt: -5,
                mb: 5,
              }}>
              Your calendars
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "60vh",
              }}>
              <TableContainer component={Paper} sx={{ my: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    {calendars.map((calendar) => (
                      <TableRow
                        key={calendar.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}>
                        <TableCell component="th" scope="row">
                          <Tooltip title="Preview">
                            <Typography
                              component={Link}
                              to={`/editor/${calendar.id}/view`}
                              variant="h6"
                              sx={{
                                mx: 1,
                                fontWeight: "bold",
                                textDecoration: "none",
                                color: "#00A8CD",
                              }}
                              onClick={() => {
                                handlePreviewEditClick(calendar.id);
                                setPreviewClicked(true);
                              }}>
                              {calendar.title ? calendar.title : "Untitled"}
                            </Typography>
                          </Tooltip>
                        </TableCell>

                        <TableCell align="right" sx={{ pr: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              component={Link}
                              to={`/editor/${calendar.id}`}
                              aria-label="edit calendar"
                              sx={{ mx: 1, color: "#00A8CD" }}
                              onClick={() => {
                                handlePreviewEditClick(calendar.id);
                                setPreviewClicked(true);
                              }}>
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              aria-label="delete calendar"
                              sx={{ mx: 1, color: "#00A8CD" }}
                              onClick={() => handleDeleteCalendar(calendar.id)}>
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    mt: 5,
                    width: "150px",
                    height: "45px",
                    backgroundColor: "#476C92",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "30px",
                    textTransform: "capitalize",
                    fontSize: "1rem",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "#476C92",
                      borderColor: "#476C92",
                      boxShadow: "none",
                      border: "1px solid",
                    },
                  }}
                  onClick={handleClick}>
                  Create New
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Box
            className="user-dashboard"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "50vh",
              justifyContent: "center",
            }}>
            <Typography
              component="h2"
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#476C92",
                mt: -5,
                mb: 5,
              }}>
              You have no calendars
            </Typography>
            <Box>
              <Button
                variant="contained"
                sx={{
                  width: "150px",
                  height: "45px",
                  backgroundColor: "#476C92",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "30px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#476C92",
                    borderColor: "#476C92",
                    boxShadow: "none",
                    border: "1px solid",
                  },
                }}
                onClick={handleClick}>
                Create new
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default User;
