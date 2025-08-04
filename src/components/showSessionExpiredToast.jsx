
import { toast } from "react-toastify";

export const showSessionExpiredToast = (handleOpenLogin) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p className="mb-2">Your session has expired. Please login again.</p>
        <button
          onClick={() => {
            handleOpenLogin();
            closeToast();
          }}
          style={{
            marginTop: '8px',
            padding: '10px 12px',
            backgroundColor: '#000000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </div>
    ),
    {
      position: 'top-right',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    }
  );
};
