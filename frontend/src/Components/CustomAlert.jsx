import { useEffect } from "react";

const CustomAlert = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = "info", 
  showCloseButton = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      if (type === "success") {
        const timer = setTimeout(() => {
          onClose();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, type, onClose]);

  if (!isOpen) return null;

  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          icon: "text-green-400",
          title: "text-green-800",
          message: "text-green-700"
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          icon: "text-red-400",
          title: "text-red-800",
          message: "text-red-700"
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          icon: "text-yellow-400",
          title: "text-yellow-800",
          message: "text-yellow-700"
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: "text-blue-400",
          title: "text-blue-800",
          message: "text-blue-700"
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const styles = getAlertStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative max-w-sm w-full mx-4 bg-white rounded-lg shadow-lg border ${styles.bg}`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${styles.icon}`}>
              {getIcon()}
            </div>
            <div className="ml-3 flex-1">
              {title && (
                <h3 className={`text-sm font-medium ${styles.title}`}>
                  {title}
                </h3>
              )}
              <div className={`mt-1 text-sm ${styles.message}`}>
                <p>{message}</p>
              </div>
            </div>
            {showCloseButton && (
              <div className="ml-auto pl-3">
                <button
                  onClick={onClose}
                  className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.icon} hover:bg-opacity-20 hover:bg-gray-500`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert; 