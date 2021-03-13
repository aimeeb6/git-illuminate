import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Dialog from "@material-ui/core/Dialog";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import DialogActions from "@material-ui/core/DialogActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from '@material-ui/core/FormLabel';
import AppTheme from "../AppTheme";
import { render } from "react-dom";
import { App } from "../../App";
const { remote } = require("electron");
const mainProcess = remote.require("../../src/main/index.js");
const currentWindow = remote.getCurrentWindow();
let repoPath = "Path to repo"

export default function FormDialog() {
  const [open, setOpen] = React.useState(true);
  const [checked, setChecked] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    render(<App />, document.getElementById("app"));
  };

  const handleChange = () => {
    setChecked(!checked);
  };

  const openFileDialog = () => {
    mainProcess.getRepoDir(currentWindow, false)[0];
  };

  return (
    <div>
      <ThemeProvider theme={AppTheme}>
        <CssBaseline />
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create A New Repo</DialogTitle>
          <DialogContent
          style={{ alignItems:"center"}}>
            <FormGroup row>
              <TextField
                autoFocus
                margin="dense"
                id="outlined-secondary"
                label="Repository Name"
                type="text"
                style={{ minWidth: "30vw",  }}
                fullWidth
              />
              <Button
              variant="outlined"
              style={{ marginLeft: "30px", height:"45px", marginTop: "10px" }}
              color="primary"
              onClick={openFileDialog}>
                set new repo path
              </Button>
              {checked ? (
                <TextField
                  autoFocus
                  margin="dense"
                  id="outlined-secondary"
                  label="Remote Link"
                  type="text"
                  style={{ minWidth: "30vw" }}
                />
              ) : (
                <div></div>
              )}
              <FormControlLabel
                style={{ padding: "0 0 0 30px", marginTop: "20px" }}
                control={
                  <Switch
                    id="mySwitch"
                    color="primary"
                    checked={checked}
                    onChange={handleChange}
                    style={{ float: "right" }}
                  />
                }
                label="Add remote to repository"
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Create Repo
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}