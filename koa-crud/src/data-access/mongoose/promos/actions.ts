import { PromosStore } from '../../../types/index';

const actions = ({ Promo }): PromosStore => {
  async function insertOnePromo(info) {
    return Promo.create(info);
  }

  return {
    insertOnePromo,
  };
};

export default actions;
