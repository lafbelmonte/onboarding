const entity = () => {
  return async function vendor({
    _id,
    name,
    type,
    dateTimeCreated,
    dateTimeUpdated,
  }) {
    if (!_id) {
      throw new Error(`Please input ID`);
    }

    if (!name) {
      throw new Error(`Please input name`);
    }

    if (!type) {
      throw new Error(`Please input type`);
    }

    if (type !== 'SEAMLESS' && type !== 'TRANSFER') {
      throw new Error(`Invalid type`);
    }

    return {
      name,
      type,
      _id,
      dateTimeCreated,
      dateTimeUpdated: new Date(),
    };
  };
};

export default entity;
