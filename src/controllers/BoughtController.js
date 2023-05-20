import BoughtModel from "../models/BoughtModel.js";
import { v4 as uuidv4 } from 'uuid';

export default class BoughtController {
  controllerCreateBought = async (obj) => {
    const BoughtModelCreate = new BoughtModel({id: uuidv4(), ...obj});
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
    const BoughtModelFind = new BoughtModel({id: uuidv4(), ...obj}, filter, options);
    const res = await BoughtModelFind.updateBought();
    return res;
  };
}
