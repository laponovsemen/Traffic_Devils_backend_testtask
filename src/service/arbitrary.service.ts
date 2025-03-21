import { ArbitraryModel } from "../models/arbitrary.model";
import {ObjectId} from "mongodb";

interface ArbitraryItem {
    _id: ObjectId;
    data: object;
}

const getArbitraryViewModel = (item: ArbitraryItem) => {
    return {
        ...item.data,
        id: item._id.toString(),
    };
};

export const arbitraryService = {
    async uploadProducts(results: any[]) {
        await ArbitraryModel.deleteMany({});
        const insertResult = await ArbitraryModel.insertMany(results.map(r => ({ data: r })));
        return insertResult.map(p => getArbitraryViewModel(p));
    },

    async get() {
        const arbitraryProducts = await ArbitraryModel.find({}).lean().exec();
        return arbitraryProducts.map(p => getArbitraryViewModel(p));
    },
};
