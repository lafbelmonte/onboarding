const entity = () => {
  return async function vendor({
    name,
    type,
    dateTimeCreated,
    dateTimeUpdated,
  }: {
    name: string;
    type: string;
    dateTimeCreated: Date;
    dateTimeUpdated: Date;
  }) {
    if (!name) {
      throw new Error(`Please input name`);
    }

    if (!type) {
      throw new Error(`Please input type`);
    }

    return {
      name,
      type,
      dateTimeCreated,
      dateTimeUpdated: new Date(),
    };
  };
};

export default entity;
