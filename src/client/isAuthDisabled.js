export const isAuthDisabled = () => {
  console.log(process.env);
  return (
    process.env.REACT_APP_USE_CLOUD_SERVICES === false ||
    process.env.REACT_APP_USE_CLOUD_SERVICES === "false" ||
    process.env.REACT_APP_ENV === "demo"
  );
};
