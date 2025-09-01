"use client"
import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

// export const metadata: Metadata = {
//   title:
//     "Tableau de bord | Cantine scolaire",
//   description: "Gestion de presence et de suivi de cantine scolaire",
// };

interface DashboardStats {
  users: number;
  students: number;
  classes: number;
  stockItems: number;
  stockQuantity: number;
  todayPresence: {
    present: number;
    absent: number;
    total: number;
    presenceRate: number;
  };
}

export default function Ecommerce() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();
        console.log('dassssssssssshhhhhhhhhhhhhhhh', data)
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    
  }, []);


  if (loading || !stats) {
    return (
    
    <div>
      <PageBreadcrumb pageTitle="Tableau de bord"/>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />         
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>
      
      </div>
    </div>
  );
  }

}
