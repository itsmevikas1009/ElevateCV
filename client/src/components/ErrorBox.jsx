const ErrorBox = ({ message }) =>
  message ? (
    <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-2">
      {message}
    </div>
  ) : null;
export default ErrorBox;
