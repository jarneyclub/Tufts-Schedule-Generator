/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * SnackBarAlert.js
 *
 *
 */
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackBarAlert = (props) => {
  const { showAlert, onCloseAlert, severity, message } = props;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={showAlert}
      autoHideDuration={3000}
      onClose={onCloseAlert}
    >
      <Alert onClose={onCloseAlert} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBarAlert;
