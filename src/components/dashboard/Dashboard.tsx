import SideNav from "../common/SideNav";
import TopNav from "../common/TopNav";
import Leaderboard from "./Leaderboard";

export function Dashboard() {
    return (
        <>
            <div style={mainDiv}>
                <TopNav />
            </div>
            <div style={sideDiv}>
                <SideNav />
                <Leaderboard />
            </div>
        </>
    );
}

import { CSSProperties } from "react";

const mainDiv: CSSProperties = {
    width: "100%",
    display: "flex", // Use flex to position children
    flexDirection: "row", // Align children in a row
    justifyContent: "space-between", // Space between TopNav and SideNav
    alignItems: "center",
    backgroundColor: "#fff",
    userSelect: "none",
};

const sideDiv: CSSProperties = {
    height: "100vh",
    width: "4vh", // Adjust width as needed
    display: "flex", // Use flex to stack items
    flexDirection: "column", // Stack items vertically
    justifyContent: "flex-start", // Align items to the top
    alignItems: "center",
    backgroundColor: "#fff",
    userSelect: "none",
};
