export const isAuthDisabled = () => {
  return (
    process.env.REACT_APP_AUTH_DISABLED === true ||
    process.env.REACT_APP_AUTH_DISABLED === "true"
  );
};