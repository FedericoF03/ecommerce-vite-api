import BoughtModel from "../models/BoughtModel.js";

export default class BoughtController {
  controllerCreateBought = async (obj) => {
    const BoughtModelCreate = new BoughtModel(obj);
    const res = await BoughtModelCreate.createBought();
    return res;
  };

  controllerFindBought = async (obj) => {
    const BoughtModelFind = new BoughtModel(obj);
    const res = await BoughtModelFind.findBought();
    return res;
  };

  controllerDeleteBought = async (filter, obj) => {
    const BoughtModelFind = new BoughtModel(obj, filter);
    const res = await BoughtModelFind.deleteBought();
    return res;
  };

  controllerUpdateBought = async (filter, obj, options) => {
    const BoughtModelFind = new BoughtModel(obj, filter, options);
    const res = await BoughtModelFind.updateBought();
    return res;
  };
}
