// import React, { createContext, useState, useContext } from "react";
// import { useSelector } from "react-redux";

// import {
//   findCurrentDayIndex,
//   findCurrentMonthIndex,
//   findCurrentWeekIndex,
//   generateDayRanges,
//   generateMonthRanges,
//   generateWeekRanges,
// } from "../utils/analyticsHelper";

// interface ScrollPositionProviderProps {
//   children: React.ReactNode;
// }

// type ScrollPositionContextType = {
//   dayScrollPosition: number;
//   weekScrollPosition: number;
//   monthScrollPosition: number;
//   setDayScrollPosition: (pos: number) => void;
//   setWeekScrollPosition: (pos: number) => void;
//   setMonthScrollPosition: (pos: number) => void;
//   resetScrollPositions: () => void;
// };

// const ScrollPositionContext = createContext<
//   ScrollPositionContextType | undefined
// >(undefined);

// export const ScrollPositionProvider: React.FC<ScrollPositionProviderProps> = ({
//   children,
// }: any) => {
//   const userSignupDate = useSelector(
//     (state: any) => state.user?.userSignupDate
//   );

//   const defaultPositions = {
//     dayScrollPosition: findCurrentDayIndex(generateDayRanges(userSignupDate)),
//     weekScrollPosition: findCurrentWeekIndex(
//       generateWeekRanges(userSignupDate)
//     ),
//     monthScrollPosition: findCurrentMonthIndex(
//       generateMonthRanges(userSignupDate)
//     ),
//   };

//   const [dayScrollPosition, setDayScrollPosition] = useState<number>(
//     defaultPositions.dayScrollPosition
//   );
//   const [weekScrollPosition, setWeekScrollPosition] = useState<number>(
//     defaultPositions.weekScrollPosition
//   );
//   const [monthScrollPosition, setMonthScrollPosition] = useState<number>(
//     defaultPositions.monthScrollPosition
//   );

//   const resetScrollPositions = () => {
//     setDayScrollPosition(defaultPositions.dayScrollPosition);
//     setWeekScrollPosition(defaultPositions.weekScrollPosition);
//     setMonthScrollPosition(defaultPositions.monthScrollPosition);
//   };

//   return (
//     <ScrollPositionContext.Provider
//       value={{
//         dayScrollPosition,
//         weekScrollPosition,
//         monthScrollPosition,
//         setDayScrollPosition,
//         setWeekScrollPosition,
//         setMonthScrollPosition,
//         resetScrollPositions,
//       }}
//     >
//       {children}
//     </ScrollPositionContext.Provider>
//   );
// };

// export const useScrollPosition = (): ScrollPositionContextType => {
//   const context = useContext(ScrollPositionContext);
//   if (!context) {
//     throw new Error(
//       "useScrollPosition must be used within a ScrollPositionProvider"
//     );
//   }
//   return context;
// };
