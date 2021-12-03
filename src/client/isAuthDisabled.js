export const isAuthDisabled = () => {
  console.dir(process.env);
  return (
    process.env.REACT_APP_USE_CLOUD_SERVICES === false ||
    process.env.REACT_APP_USE_CLOUD_SERVICES === "false" ||
    process.env.REACT_APP_ENV === "demo"
  );
};
