import { Snackbar, Alert } from "@mui/material"

const AlertComponent = ({ open, setOpen, message }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={5000}
      onClose={() => setOpen(false)}
    >
      <Alert severity={message.success ? "success" : "warning"}>{message.success ? message.success : message.error && message.error}</Alert>
    </Snackbar>
  )
}
export default AlertComponent