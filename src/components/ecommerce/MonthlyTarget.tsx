"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { ArrowDownIcon, ArrowUpIcon, MoreDotIcon } from "@/icons";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MonthlyTarget() {
  const [presenceRate, setPresenceRate] = useState(0);
  const [rateChange, setRateChange] = useState(0);
  const [inscrit, setInscrit] = useState(0);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [inscritChange, setInscritChange] = useState(0);
  const [presentChange, setPresentChange] = useState(0);
  const [absentChange, setAbsentChange] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/dashboard/presence')  // Changement d'endpoint
      .then(res => res.json())
      .then(data => {
        setPresenceRate(data.presenceRate);
        setRateChange(data.rateChange);
        setInscrit(data.inscrit);
        setPresent(data.present);
        setAbsent(data.absent);
        setInscritChange(data.inscritChange);
        setPresentChange(data.presentChange);
        setAbsentChange(data.absentChange);
      })
      .catch(err => console.error('Error fetching presence data:', err));
  }, []);


  const series = [presenceRate];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const getChangeIcon = (change: number, isGoodUp: boolean = true) => {
    if (change === 0) return null;
    const isUp = change > 0;
    const color = (isUp && isGoodUp) || (!isUp && !isGoodUp) ? "#039855" : "#D92D20";
    const Icon = isUp ? ArrowUpIcon : ArrowDownIcon;
    return <Icon fill={color} width="16" height="16" />;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Taux de présence</h3>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]">
            <ReactApexChart options={options} series={series} type="radialBar" height={330} />
          </div>
          <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${rateChange >= 0 ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'}`}>
            {rateChange >= 0 ? '+' : ''}{rateChange}%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Taux de présence des 7 derniers jours.
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Total</p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {inscrit}
            {getChangeIcon(inscritChange, true)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Présent</p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {present}
            {getChangeIcon(presentChange, true)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Absent</p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {absent}
            {getChangeIcon(absentChange, false)}
          </p>
        </div>
      </div>
    </div>
  );
}