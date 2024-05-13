import { useState } from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { hatchImageSet, hatchImageDelete } from "../../features/calendarSlice";
import { useDispatch, useSelector } from "react-redux";

const UploadImage = ({ hatchNumber }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const hatchImage = useSelector((state) => {
    const hatch = state.calendar.dates.find(
      (hatch) => hatch.number === hatchNumber
    );
    return hatch ? hatch.image : "";
  });
  let fileName = hatchImage.fileName ? hatchImage.fileName : "No file chosen";

  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setOpen(!open)}
            sx={{ color: "#476C92" }}
          >
            <ListItemText
              primary={<PhotoOutlinedIcon sx={{ color: "#476C92" }} />}
            />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pr: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{
                  padding: "5px 10px",
                  marginBottom: "5px",
                  color: "#476C92",
                  borderColor: "#476C92",
                }}
              >
                Upload file
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    dispatch(
                      hatchImageSet({
                        url: URL.createObjectURL(e.target.files[0]),
                        fileName: e.target.files[0].name,
                        hatchNumber,
                      })
                    );
                  }}
                />
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ color: "#476C92" }}>
                  {fileName}
                </Typography>
                {hatchImage.fileName && (
                  <IconButton
                    onClick={() =>
                      dispatch(
                        hatchImageDelete({
                          hatchNumber,
                        })
                      )
                    }
                  >
                    <ClearIcon sx={{ color: "#476C92" }} />
                  </IconButton>
                )}
              </Box>
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
    </>
  );
};

export default UploadImage;
