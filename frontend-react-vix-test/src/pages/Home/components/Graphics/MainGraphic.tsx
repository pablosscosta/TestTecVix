import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { Stack, Typography } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZGlobalVar } from "../../../../stores/useZGlobalVar";
import { IFormatData } from "../../../../types/socketType";

/**
 * Gera dados mockados de uso de CPU
 */
const generateMockCpuData = (): IFormatData[] => {
  const data: IFormatData[] = [];
  let currentValue = 45;

  for (let i = 0; i < 15; i++) {
    // variação suave
    const variation = Math.random() * 10 - 5;
    currentValue = Math.min(95, Math.max(30, currentValue + variation));

    data.push({
      time: `T-${14 - i}`,
      value: Number(currentValue.toFixed(2)),
    });
  }

  return data;
};

export const MainGraphic = () => {
  const [chartData] = useState<IFormatData[]>(() =>
    generateMockCpuData()
  );

  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { currentVMName: vmName } = useZGlobalVar();

  const lastCpuUsage = chartData[chartData.length - 1]?.value || 0;

  const valueColor =
    lastCpuUsage < 70
      ? theme[mode].ok
      : lastCpuUsage < 90
      ? theme[mode].warning
      : theme[mode].danger;

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          padding: "2px",
          color: theme[mode].primary,
          fontWeight: "500",
          paddingRight: "24px",
        }}
      >
        {`${t("graphics.cpuUsage")} - ${vmName}`}
        <span style={{ color: theme[mode].gray, fontWeight: "300" }}>
          {" "}
          {t("graphics.currentUse")}{" "}
          <span style={{ color: valueColor }}>
            {lastCpuUsage.toFixed(2)}%
          </span>
        </span>
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme[mode].gray} />

          <XAxis
            dataKey="time"
            tick={{ fill: theme[mode].dark, fontSize: 10 }}
            label={{
              value: t("graphics.time"),
              position: "insideBottomRight",
              offset: -5,
              fill: theme[mode].dark,
              fontSize: 10,
            }}
          />

          <YAxis
            tick={{ fill: theme[mode].dark, fontSize: 10 }}
            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.16)]}
            label={{
              value: t("graphics.cpuUsage"),
              angle: -90,
              position: "insideLeft",
              fill: theme[mode].dark,
              fontSize: 10,
            }}
          />

          <Tooltip
            formatter={(value) =>
              `${Number(value).toFixed(2)}%`
            }
          />

          <Legend />

          <ReferenceLine
            y={70}
            stroke="yellow"
            strokeDasharray="3 3"
          />

          <ReferenceLine
            y={90}
            stroke="red"
            strokeDasharray="3 3"
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            dot={false}
            isAnimationActive={false}
            legendType="none"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Stack>
  );
};
