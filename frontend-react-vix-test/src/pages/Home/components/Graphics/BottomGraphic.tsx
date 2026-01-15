import { useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Bar,
} from "recharts";
import { Stack, Typography } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZGlobalVar } from "../../../../stores/useZGlobalVar";
import { IFormatData } from "../../../../types/socketType";

/**
 * Gera dados mockados de uso de Memória
 */
const generateMockMemoryData = (): IFormatData[] => {
  const data: IFormatData[] = [];
  let currentValue = 55;

  for (let i = 0; i < 15; i++) {
    const variation = Math.random() * 12 - 6;
    currentValue = Math.min(95, Math.max(35, currentValue + variation));

    data.push({
      time: `T-${14 - i}`,
      value: Number(currentValue.toFixed(2)),
    });
  }

  return data;
};

export const BottomGraphic = () => {
  const [chartData] = useState<IFormatData[]>(() =>
    generateMockMemoryData()
  );

  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { currentVMName: vmName } = useZGlobalVar();

  const lastMemoryData =
    chartData[chartData.length - 1]?.value || 0;

  const valueColor =
    lastMemoryData < 80 ? theme[mode].ok : theme[mode].danger;

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          color: theme[mode].primary,
          fontSize: "12px",
          fontWeight: "500",
          marginLeft: "20px",
        }}
      >
        {`${t("graphics.memoryUsage")} - ${vmName}`}{" "}
        <span style={{ color: theme[mode].gray, fontWeight: "300" }}>
          {t("graphics.currentUse")}{" "}
          <span style={{ color: valueColor }}>
            {lastMemoryData.toFixed(2)}%
          </span>
        </span>
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
              value: t("graphics.memoryUsage"),
              angle: -90,
              position: "insideLeft",
              fill: theme[mode].dark,
              fontSize: 10,
              dy: 48,
            }}
          />

          <Tooltip
            formatter={(value) =>
              `${Number(value).toFixed(2)}%`
            }
          />

          <Legend />

          <ReferenceLine
            y={80}
            stroke="red"
            strokeDasharray="3 3"
          />

          <Bar
            dataKey="value"
            fill="#413ea0"
            legendType="none"
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#ff7300"
            dot={false}
            isAnimationActive={false}
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Stack>
  );
};
