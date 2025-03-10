"use client";

import ButtonComponent from "@/components/button-component";
import DashboardLayout from "@/components/dashboard-layout-component";
import CreatePPM from "@/components/ppm/createPPM";
import CreateBulk from "@/components/user-management/create-bulk";
import { useDataPermission } from "@/context";
import createAxiosInstance from "@/utils/api";
import moment from "moment";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

export default function Ppm() {
  const axiosInstance = createAxiosInstance();
  const {
    centralState,
    setCentralState,
    centralStateDelete,
    setCentralStateDelete,
    setSuccessState,
  } = useDataPermission();

  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // API & calendar data state
  const [ppms, setPpms] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // States for optional end date controls
  const [selectedEndMonth, setSelectedEndMonth] = useState<number | null>(null);
  const [selectedEndYear, setSelectedEndYear] = useState<number | null>(null);

  const [showAll, setShowAll] = useState<any[]>([]);

  // Month names (0-indexed)
  const months = [
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

  // Define a range of years (e.g. currentYear-2 to currentYear+2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  // Build the API query using the start date and either a custom end date (if selected)
  // or the default (the first day of the next month).
  const getPPMS = async () => {
    const monthString = (selectedMonth + 1).toString().padStart(2, "0");
    const startDate = `${selectedYear}-${monthString}-01`;

    let endDate = "";
    if (selectedEndYear !== null && selectedEndMonth !== null) {
      const endMonthString = (selectedEndMonth + 1).toString().padStart(2, "0");
      endDate = `${selectedEndYear}-${endMonthString}-01`;
    } else {
      let endYear = selectedYear;
      let endMonth = selectedMonth + 2;
      if (endMonth > 12) {
        endMonth = 1;
        endYear = selectedYear + 1;
      }
      const endMonthString = endMonth.toString().padStart(2, "0");
      endDate = `${endYear}-${endMonthString}-01`;
    }

    const token = localStorage.getItem("authToken");
    try {
      const response = await axiosInstance.get(
        `/ppms?startDate=${startDate}&endDate=${endDate}`
      );
      setPpms(response.data.data);
    } catch (error) {
      console.error("Error fetching PPMs:", error);
    }
  };

  // UPDATED: Only show the event on the day its startDate occurs.
  const getWorkForDay = (day: number) => {
    const currentDate = new Date(selectedYear, selectedMonth, day);
    return ppms.filter(({ occurrenceDate }) => {
      const eventDate = new Date(occurrenceDate);
      return (
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getDate() === currentDate.getDate()
      );
    });
  };

  // Compute the number of days in the selected start month.
  const getDaysInMonth = (month: number, year: number) => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);

  // Refresh PPM data whenever the start or end date selection or modal state changes.
  useEffect(() => {
    getPPMS();
  }, [
    selectedYear,
    selectedMonth,
    selectedEndYear,
    selectedEndMonth,
    centralState,
  ]);

  // Modal content mapping.
  const componentMap: Record<string, JSX.Element> = {
    createPPM: (
      <CreatePPM
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    createBulkPPM: (
      <CreateBulk
        type="PPMs"
        activeRowId={activeRowId}
        setModalState={setCentralState}
        setSuccessState={setSuccessState}
      />
    ),
    showAll: (
      <div className="bg-white p-4 rounded-lg shadow-md">
        {showAll.map((work, index) => {
          const statusColor =
            work.status === "Initiated"
              ? "text-green-700"
              : work.status === "Active"
              ? "text-blue-500"
              : "text-blue-500";
          const statusColorBg =
            work.status === "Initiated"
              ? "bg-green-500"
              : work.status === "Active"
              ? "bg-blue-500"
              : "bg-blue-500";

          return (
            <Link
              href={`/ppm/${work.id}`}
              key={index}
              onClick={() => setCentralState("")}
              className="flex items-center gap-2 p-2 rounded-md transition-all duration-200 hover:bg-gray-100"
            >
              <span
                className={`${statusColorBg} hover:bg-blue-500 h-1.5 w-1.5 rounded-full mr-2`}
              ></span>
              <span
                className={`truncate ${statusColor} hover:text-blue-500 text-xs`}
              >
                {work.title} - {moment(work.occurrenceDate).format("lll")}
              </span>
            </Link>
          );
        })}
      </div>
    ),
  };

  return (
    <DashboardLayout
      title="PPM"
      detail="View Work Calendar"
      getTitle={() =>
        centralState === "showAll" ? "Show PPMs" : "Create PPMs"
      }
      getDetail={() =>
        centralState === "createBulkPPM" ? "Import CSV/Excel file" : ""
      }
      componentMap={componentMap}
      setActiveRowId={setActiveRowId}
    >
      <div className="relative bg-white rounded-2xl p-4 mb-4">
        <div className="flex sm:flex-row flex-col items-center md:space-x-2 space-x-0 space-y-2 md:space-y-0 font-semibold text-md">
          <div className="flex items-center border rounded-md w-full sm:w-[70%]">
            {/* <label className="block text-sm font-semibold mb-2">Date</label> */}
            <div className="flex items-center border p-3 rounded-md bg-gray-50 w-full">
              {/* Start Date */}
              <div className="flex items-center">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="p-2 border rounded-md"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="p-2 border rounded-md ml-2"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Separator */}
              <span className="hidden mx-3 text-gray-500">to</span>

              {/* End Date (Optional) */}
              <div className="hidden flex items-center">
                <select
                  value={selectedEndYear !== null ? selectedEndYear : ""}
                  onChange={(e) =>
                    setSelectedEndYear(
                      e.target.value === "" ? null : parseInt(e.target.value)
                    )
                  }
                  className="p-2 border rounded-md"
                >
                  <option value="">Default</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedEndMonth !== null ? selectedEndMonth : ""}
                  onChange={(e) =>
                    setSelectedEndMonth(
                      e.target.value === "" ? null : parseInt(e.target.value)
                    )
                  }
                  className="p-2 border rounded-md ml-2"
                >
                  <option value="">Default</option>
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <ButtonComponent
            text="Add New PPM"
            onClick={() => setCentralState("createPPM")}
            className="flex-1 px-4 py-3 text-white bg-[#A8353A]"
          />
          <ButtonComponent
            text="Bulk PPM"
            onClick={() => setCentralState("createBulkPPM")}
            className="flex-1 px-4 py-3 text-[#A8353A] bg-white border border-[#A8353A]"
          />
        </div>
      </div>

      {/* Unified Date Range Picker */}

      <div className="p-4 bg-white rounded-xl">
        {/* <h2 className="text-base font-bold mb-4">
          {months[selectedMonth]} {selectedYear} to{" "}
          {selectedEndYear !== null && selectedEndMonth !== null
            ? `${months[selectedEndMonth]} ${selectedEndYear}`
            : "Next Month (Default)"}
        </h2> */}

        <h2 className="text-base font-bold mb-4">
          {months[selectedMonth]} {selectedYear}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-7 gap-0">
          {[
            "Mon 🧟",
            "Tue ☕",
            "Wed 🐪",
            "Thu 🧠",
            "Fri 🍸",
            "Sat 🎉",
            "Sun 💆‍♂",
          ].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-500 p-2"
            >
              {day}
            </div>
          ))}
          {days.map((day) => (
            <div
              key={day}
              className="relative border border-gray-100 p-1 text-center hover:bg-gray-100 flex flex-col justify-end h-48"
            >
              <div className="absolute top-2 left-2 font-bold text-sm">
                {day}
              </div>
              <ul className="text-sm text-gray-600">
                {getWorkForDay(day)
                  .slice(0, 3)
                  .map((work, index) => {
                    const statusColor =
                      work.status === "Initiated"
                        ? "text-green-700"
                        : work.status === "Active"
                        ? "text-blue-500"
                        : "text-blue-500";
                    const statusColorBg =
                      work.status === "Initiated"
                        ? "bg-green-500"
                        : work.status === "Active"
                        ? "bg-blue-500"
                        : "bg-blue-500";

                    return (
                      <li key={index}>
                        <Link
                          href={`/ppm/${work.id}`}
                          className="flex items-center"
                        >
                          <span
                            className={`${statusColorBg} hover:bg-blue-500 h-1.5 w-1.5 rounded-full mr-2`}
                          ></span>
                          <span
                            className={`truncate ${statusColor} hover:text-blue-500 text-xs`}
                          >
                            {work.title}{" "}
                            {moment.utc(work.occurrenceDate).format("LT")}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
              {getWorkForDay(day).length > 3 && (
                <div
                  onClick={() => {
                    setCentralState("showAll");
                    setShowAll(getWorkForDay(day));
                  }}
                  className="mt-2 text-blue-600 hover:underline text-xs text-left cursor-pointer"
                >
                  + Show More
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
