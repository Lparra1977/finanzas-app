import { useMemo } from "react";
import { quincenaOfDate, monthKeyOfDate } from "./utils";

export function usePeriodComputation(data, monthKey, quincena) {
  return useMemo(() => {
    const period = data.periods[monthKey] || { q1Income: 0, q2Income: 0 };
    const income =
      quincena === "ALL"
        ? (period.q1Income || 0) + (period.q2Income || 0)
        : quincena === "Q1"
        ? period.q1Income || 0
        : period.q2Income || 0;

    const activeCatalog = data.catalog.filter((c) => c.active);

    const fixedFor = (q) =>
      activeCatalog.reduce(
        (acc, c) => {
          const amt = q === "Q1" ? c.q1 : c.q2;
          if (c.category === "Gasto") acc.gasto += amt;
          else acc.ahorro += amt;
          return acc;
        },
        { gasto: 0, ahorro: 0 }
      );

    const f1 = fixedFor("Q1");
    const f2 = fixedFor("Q2");
    const fixedGasto = quincena === "ALL" ? f1.gasto + f2.gasto : quincena === "Q1" ? f1.gasto : f2.gasto;
    const fixedAhorro = quincena === "ALL" ? f1.ahorro + f2.ahorro : quincena === "Q1" ? f1.ahorro : f2.ahorro;

    const txInScope = data.transactions.filter((t) => {
      if (monthKeyOfDate(t.date) !== monthKey) return false;
      if (quincena === "ALL") return true;
      return quincenaOfDate(t.date) === quincena;
    });
    const variableGasto = txInScope.reduce((a, t) => a + t.amount, 0);

    const gastoTotal = fixedGasto + variableGasto;
    const pct = income > 0 ? (gastoTotal / income) * 100 : 0;
    const saldoLibre = income - gastoTotal - fixedAhorro;

    return {
      income,
      fixedGasto,
      fixedAhorro,
      variableGasto,
      gastoTotal,
      pct,
      saldoLibre,
      activeFixedItems: activeCatalog.filter((c) =>
        quincena === "ALL" ? true : quincena === "Q1" ? c.q1 > 0 : c.q2 > 0
      ),
      txInScope,
    };
  }, [data, monthKey, quincena]);
}
