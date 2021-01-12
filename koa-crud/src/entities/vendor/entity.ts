const entity = () => {
  return async function vendor({ name, type }) {
    if (!name) {
      throw new Error(`Please input name`);
    }

    if (!type) {
      throw new Error(`Please input type`);
    }

    return {
      name,
      type,
    };
  };
};

export default entity;
