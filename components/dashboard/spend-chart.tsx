"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    { date: "Jan", spend: 2400 },
    { date: "Feb", spend: 1398 },
    { date: "Mar", spend: 9800 },
    { date: "Apr", spend: 3908 },
    { date: "May", spend: 4800 },
    { date: "Jun", spend: 3800 },
    { date: "Jul", spend: 4300 },
];

export function SpendChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        stroke="#52525b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#52525b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-zinc-500">
                                                    Spend
                                                </span>
                                                <span className="font-bold text-zinc-50">
                                                    ${payload[0].value}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="spend"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSpend)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
