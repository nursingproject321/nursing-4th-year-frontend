import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

class HospitalStore {
    list = [];

    totalCount = 0;

    fetched = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAll() {
        const response = await axios.post(
            "/agency/list",
            {
                type: "hospital"
            }
        );
        const { data, totalCount } = response.data;
        runInAction(() => {
            this.list = data;
            this.totalCount = totalCount;
            this.fetched = true;
        });
    }

    // async get(id) {
    //     if (this.fetched) {
    //         return this.list.find((obj) => obj._id === id);
    //     }

    //     const response = await axios.get(`/hospitals/${id}`);
    //     return response.data;
    // }

    // async addNew(params) {
    //     const response = await axios.post("/hospitals", params);
    //     runInAction(() => {
    //         this.list.unshift(response.data);
    //         this.totalCount += 1;
    //     });
    // }

    // async edit(id, params) {
    //     const response = await axios.patch(`/hospitals/${id}`, params);
    //     runInAction(() => {
    //         const index = this.list.findIndex((obj) => obj._id === id);
    //         this.list[index] = response.data;
    //     });
    // }

    async delete(index) {
        const toDeleteId = this.list[index]._id;
        await axios.post("/agency/delete", {
            _id: toDeleteId
        });
        runInAction(() => {
            this.list.splice(index, 1);
            this.totalCount -= 1;
        });
    }

    async deleteMultiple(indexes) {
        const toDeleteIds = indexes.map((index) => this.list[Number(index)]._id);
        // console.log("toDeleteIds", toDeleteIds);
        // await axios.post("/hospitals/delete", toDeleteIds);
        toDeleteIds.forEach(async (id) => {
            await axios.post("/agency/delete", {
                _id: id
            });
        });
        await this.fetchAll();
    }

    async import(data) {
        await axios.post("/agency/import", data);
        await this.fetchAll();
    }
}

export default HospitalStore;
