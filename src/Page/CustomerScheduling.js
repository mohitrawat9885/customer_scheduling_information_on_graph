import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import "./CustomerScheduling.scss";
import BarChart from "react-bar-chart";

// Reading data and converting in structured form
const data = require("./data").data;
let schedules = {};

for (let i in data) {
  if (!schedules[`${data[i].item_date}`]) {
    schedules[`${data[i].item_date}`] = {};
    schedules[`${data[i].item_date}`][
      `${data[i].schedule_time.split(" ")[0]}`
    ] = [
      {
        time: data[i].schedule_time.split(" ")[1],
        slot: data[i].slot,
      },
    ];
  } else {
    if (
      !schedules[`${data[i].item_date}`][
        `${data[i].schedule_time.split(" ")[0]}`
      ]
    ) {
      schedules[`${data[i].item_date}`][
        `${data[i].schedule_time.split(" ")[0]}`
      ] = [
        {
          time: data[i].schedule_time.split(" ")[1],
          slot: data[i].slot,
        },
      ];
    } else {
      schedules[`${data[i].item_date}`][
        `${data[i].schedule_time.split(" ")[0]}`
      ].push({
        time: data[i].schedule_time.split(" ")[1],
        slot: data[i].slot,
      });
    }
  }
}

// end of reading data

const margin = { top: 20, right: 20, bottom: 30, left: 40 };

export default function CustomerScheduling() {
  const [value, setValue] = React.useState(new Date());
  const [dateAndSchedules, setDateAndSchedules] = useState([
    { text: "Item Date is not Selected.", value: 0 },
  ]);

  const [timeAndSchedules, setTimeAndSchedules] = useState([
    { text: "Schedule Date is not Selected.", value: 0 },
  ]);
  const monthNames = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function RenderCustomerScheduling(item_date) {
    let date = new Date(item_date);
    let date_key = `${date.getFullYear()}-${
      date.getMonth() * 1 + 1 < 10
        ? "0" + (date.getMonth() * 1 + 1)
        : date.getMonth() * 1 + 1
    }-${date.getDate()}`;

    setTimeAndSchedules([{ text: "Schedule Date is not Selected.", value: 0 }]);
    if (!schedules[date_key]) {
      setDateAndSchedules([
        {
          text: "Item Date is not Selected or this date have no Item.",
          value: 0,
        },
      ]);
      return;
    }

    let scheduled_data = [];

    for (let d in schedules[date_key]) {
      let sch_num = Object.keys(schedules[date_key][d]).length;
      scheduled_data.push({
        text: `${d.split("-")[2]} ${
          monthNames[Number(d.split("-")[1])]
        } ( ${sch_num} Scheduled)`,
        value: sch_num,
        schedule_time: d,
        item_date: date_key,
      });
    }
    setDateAndSchedules(scheduled_data);
  }

  function handleBarClick(element, id) {
    const time_sch = schedules[element.item_date][element.schedule_time];
    let s_9am_12am = Number(0),
      s_12am_3pm = 0,
      s_3pm_6pm = 0,
      s_6pm_9pm = 0,
      s_9pm_12pm = 0,
      s_12pm_3am = 0,
      s_3am_6am = 0,
      s_6am_9am = 0;

    for (let i in time_sch) {
      let hour = Number(time_sch[i].time.split(":")[0]);
      if (hour >= 9 && hour < 12) s_9am_12am++;
      if (hour >= 12 && hour < 15) s_12am_3pm++;
      if (hour >= 15 && hour < 18) s_3pm_6pm++;
      if (hour >= 18 && hour < 21) s_6pm_9pm++;
      if (hour >= 21 && hour < 24) s_9pm_12pm++;
      if (hour === 24 || hour < 3) s_12pm_3am++;
      if (hour >= 3 && hour < 6) s_3am_6am++;
      if (hour >= 6 && hour < 9) s_6am_9am++;
    }

    setTimeAndSchedules([
      { text: `09AM to 12AM ( ${s_9am_12am} Scheduled )`, value: s_9am_12am },
      { text: `12AM to 03PM ( ${s_12am_3pm} Scheduled )`, value: s_12am_3pm },
      { text: `03PM to 06PM ( ${s_3pm_6pm} Scheduled )`, value: s_3pm_6pm },
      { text: `06PM to 09PM ( ${s_6pm_9pm} Scheduled )`, value: s_6pm_9pm },
      { text: `09PM to 12PM ( ${s_9pm_12pm} Scheduled )`, value: s_9pm_12pm },
      { text: `12PM to 03AM ( ${s_12pm_3am} Scheduled )`, value: s_12pm_3am },
      { text: `03AM to 06AM ( ${s_3am_6am} Scheduled )`, value: s_3am_6am },
      { text: `06AM to 09AM ( ${s_6am_9am} Scheduled )`, value: s_6am_9am },
    ]);
  }

  return (
    <div className="page-div">
      <div className="date-picker">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            value={value}
            onChange={(newValue) => {
              RenderCustomerScheduling(newValue);
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <div className="schedule-bar-chart">
        <BarChart
          ylabel="Number of Scheduled"
          width={2000}
          height={400}
          margin={margin}
          data={dateAndSchedules}
          onBarClick={handleBarClick}
        />
      </div>
      <div className="time-bar-chart">
        <BarChart
          ylabel="Number of Scheduled in time range"
          width={2000}
          height={400}
          margin={margin}
          data={timeAndSchedules}

          // onBarClick={handleBarClick}
        />
      </div>
    </div>
  );
}
