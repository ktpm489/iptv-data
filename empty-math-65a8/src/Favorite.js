import { useState, useRef, forwardRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Page from "./components/Page";
// MUI
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Zoom from "@mui/material/Zoom";
// Icons
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
// Others
import { GlobalContext } from "./App";
import db from "./config/dexie";
const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default function Playlists() {
  const navigate = useNavigate();
  // _ States
  // Add playlist menu state
  const [playlistContextMenuAnchorEl, setPlaylistContextMenuAnchorEl] =
    useState(null);
  const [playlistTargetIndex, setPlaylistTargetIndex] = useState(null);
  // Delete playlist state
  const [deletePlaylistDialogOpen, setDeleteDialogOpen] =
    useState(false);

  // __ Context
  const {
    favoritesData,
  } = useContext(GlobalContext);

  // __ Functions


  

  // Playlist item function
  const handlePlayItem = (name) => {
      navigate(`/play/${encodeURIComponent(name)}`);
  };

  // Playlist context menu functions
  const handlePlaylistContextMenuOpen = (event, index) => {
    event.stopPropagation();
    // setPlaylistContextMenuAnchorEl(event.currentTarget);
    setPlaylistTargetIndex(index);
    handleDeleteChannelDialogOpen();
  };
  const handlePlaylistContextMenuClose = () => {
    setPlaylistContextMenuAnchorEl(null);
    setPlaylistTargetIndex(null);
  };

  // Delete playlist dialog functions
  const handleDeleteChannelDialogOpen = () => {
    setPlaylistContextMenuAnchorEl(null);
    setDeleteDialogOpen(true);
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  const handleDeleteChannelTrigger = async () => {
    setDeleteDialogOpen(false);
    await db.favorLists
      .where("name")
      .equals(favoritesData[playlistTargetIndex]?.name)
      .delete();
  };

 

  return (
    <Page title="Favorite Links" >
      <List>
        {favoritesData?.map((favorItemObj, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handlePlayItem(favorItemObj?.name)}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label={`show context menu for ${favorItemObj?.name} playlist`}
                aria-controls="playlist-context-menu"
                aria-haspopup="true"
                onClick={(event) => handlePlaylistContextMenuOpen(event, index)}
              >
               <DeleteIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText
              primary={favorItemObj?.name}
            />
          </ListItem>
        ))}
      </List>
      <Menu
        id="playlist-context-menu"
        anchorEl={playlistContextMenuAnchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(playlistContextMenuAnchorEl)}
        onClose={handlePlaylistContextMenuClose}
      >
        <MenuItem onClick={handleDeleteChannelDialogOpen}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <Dialog
        open={deletePlaylistDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-playlist-dialog-title"
        aria-describedby="delete-playlist-dialog-description"
        TransitionComponent={Transition}
      >
        <DialogTitle id="delete-playlist-dialog-title">
          Are you sure to delete {favoritesData[playlistTargetIndex]?.name}{" "}
          channel?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button color="error" onClick={handleDeleteChannelTrigger} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
