import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { FETCH_LIMIT } from "../components/utils";

export default class StudentStore {
    list = [];

    totalCount = 0;

    fetched = false;

    constructor() {
        makeAutoObservable(this);
    }

    // async fetch(params = {}) {
    async fetch() {
        // params.limit = FETCH_LIMIT;
        const response = await axios.get("/student/list");
        const { data, totalCount } = response.data;
        runInAction(() => {
            this.list = data;
            this.totalCount = totalCount;
            this.fetched = true;
            // if (params.start === 0) {
            //     this.list = data.map((obj) => ({
            //         ...obj,
            //         placementsHistoryLength: obj.placementsHistory?.length || 0
            //     }));
            //     this.totalCount = totalCount;
            //     this.fetched = true;
            // } else {
            //     this.list = toJS(this.list).concat(data);
            // }
        });
    }

    async fetchPlacements(id) {
        const rowIndex = this.list.findIndex((obj) => obj._id === id);
        const student = this.list[rowIndex];

        if (student && student.detailedPlacementLocationHistory) {
            return student.detailedPlacementLocationHistory;
        }

        const response = await axios.get(`/location_form/${id}/placements`);
        if (this.list[rowIndex]) {
            this.list[rowIndex].detailedPlacementLocationHistory = response.data;
        }
        return response.data;
    }

    async get(id) {
        const rowIndex = this.list.findIndex((obj) => obj._id === id);
        const student = this.list[rowIndex];

        if (student && student.fetchedInDetail) {
            return student;
        }

        const response = await axios.get(`/location_form/${id}`);
        const newData = {
            ...response.data,
            fetchedInDetail: true
        };
        if (rowIndex > -1) {
            this.list[rowIndex] = newData;
        }

        return newData;
    }

    async addNew(params) {
        const response = await axios.post("/location_form", params);
        runInAction(() => {
            this.list.unshift(response.data);
            this.totalCount += 1;
        });
    }

    async edit(id, params) {
        const response = await axios.patch(`/location_form/${id}`, params);
        runInAction(() => {
            const index = this.list.findIndex((obj) => obj._id === id);
            this.list[index] = response.data;
        });
    }

    async delete(index) {
        const toDeleteId = this.list[index]._id;
        await axios.delete(`/location_form/${toDeleteId}`);
        runInAction(() => {
            this.list.splice(index, 1);
            this.totalCount -= 1;
        });
    }

    async deleteMultiple(indexes) {
        const toDeleteIds = indexes.map((index) => this.list[Number(index)]._id);
        await axios.post("/location_form/delete", toDeleteIds);
        await this.fetch();
    }

    async import(data) {
        await axios.post("/location_form/import", data);
        await this.fetch();
    }
}
