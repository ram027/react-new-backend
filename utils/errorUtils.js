import _ from "lodash";

export const formatDbError = (err) => {
  if (err.errors) {
    const errMessage = Object.values(err.errors)[0];
    return errMessage.message;
  }
  return err.message;
};

export const isEmptyFields = (obj) => {
  const objValues = Object.values(obj);
  if (
    _.includes(objValues, "") ||
    _.includes(objValues, null) ||
    _.includes(objValues, undefined)
  ) {
    return true;
  } else {
    return false;
  }
};
