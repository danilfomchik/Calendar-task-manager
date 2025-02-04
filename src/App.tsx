import MainPage from "./pages/Main";

// array for years
// obj for 12 months (key -> name of month, value -> from 1 to 12)
// days renders my Array.from(daysInMonth(month, year))
//

function App() {
  // function daysInMonth(month: number, year: number) {
  //     // console.log(new Date(year, month, 0).getMonth());

  //     const date = new Date(year, month, 0);

  //     // Getting full month name (e.g. "September")
  //     // const monthName = date.toLocaleString("default", { month: "long" });

  //     // console.log(monthName);

  //     return date.getDate();
  // }

  // const month = 2;
  // const year = 2025;

  // const result =
  //     "Number of days in " +
  //     month +
  //     " and month of the year " +
  //     year +
  //     " is " +
  //     daysInMonth(month, year);

  return <MainPage />;
}

export default App;
