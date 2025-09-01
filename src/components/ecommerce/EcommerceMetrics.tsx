"use client";
import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { DashboardService } from "@/services/dashboard";

type Stats = {
  numUsers: number;
  numStudents: number;
  numClasses: number;
  stock: number;
  stockItems?: number;
};

export const EcommerceMetrics = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await DashboardService.getStats();
        setStats(data);
        console.log('Données reçues:', data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        console.error('Erreur détaillée:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Chargement des données...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Erreur: {error}</div>;
  }

  if (!stats) {
    return <div className="p-6 text-center">Aucune donnée disponible</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Utilisateurs */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Utilisateurs</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{stats.numUsers}</h4>
          </div>
        </div>
      </div>

      {/* Elèves */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Elèves</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{stats.numStudents}</h4>
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Classes</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{stats.numClasses}</h4>
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Stock</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{stats.stockItems}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};