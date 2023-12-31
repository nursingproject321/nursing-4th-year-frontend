import { createContext, useContext } from "react";
import HospitalStore from "./hospital-store";
import CommunityStore from "./community-store";
import InstructorStore from "./instructor-store";
import PlacementLocationStore from "./placement-location-store";
import PlacementStore from "./placement-store";
import SchoolStore from "./school-store";
import StudentStore from "./student-store";

export const store = {
    hospitalStore: new HospitalStore(),
    communityStore: new CommunityStore(),
    // instructorStore: new InstructorStore(),
    // placementLocationStore: new PlacementLocationStore(),
    studentStore: new StudentStore()
    // placementStore: new PlacementStore()
};

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
