import React from "react";
import "./ticket-distribution.css";
import { ResponsiveLine } from "@nivo/line";
import { useSelector } from "react-redux";
import { TicketsModel } from "../../tickets/interface";
import { formatTicketDistribution } from "../../../utils/api";

const TickeDistribution = () => {
    const allTickets = useSelector(
        (state: { tickets: { value: [TicketsModel] } }) => state.tickets.value
    );

    const data = formatTicketDistribution(allTickets);

    return (
        <div className="ticket-distribution-card">
            <h3 className="card-title">Ticket Distribution</h3>
            <div className="chart-wrapper">
                <ResponsiveLine
                    data={data}
                    margin={{ top: 20, right: 120, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{
                        type: "linear",
                        min: 0,
                        max: "auto",
                        stacked: false,
                        reverse: false,
                    }}
                    curve="monotoneX"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 10,
                        tickRotation: -45,
                        legendOffset: 45,
                        legendPosition: "middle",
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 10,
                        tickRotation: 0,
                        legend: "Count",
                        legendOffset: -50,
                        legendPosition: "middle",
                    }}
                    enableGridX={false}
                    enableGridY={true}
                    colors={["#6366f1", "#ec4899", "#14b8a6"]}
                    lineWidth={3}
                    enablePoints={true}
                    pointSize={8}
                    pointColor={{ theme: "background" }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "serieColor" }}
                    enablePointLabel={false}
                    enableArea={false}
                    useMesh={true}
                    theme={{
                        axis: {
                            ticks: {
                                text: {
                                    fill: "#e2e8f0",
                                    fontSize: 12,
                                },
                            },
                            legend: {
                                text: {
                                    fill: "#f1f5f9",
                                    fontSize: 13,
                                    fontWeight: 600,
                                },
                            },
                        },
                        grid: {
                            line: {
                                stroke: "rgba(255, 255, 255, 0.1)",
                            },
                        },
                        legends: {
                            text: {
                                fill: "#f1f5f9",
                                fontSize: 12,
                            },
                        },
                    }}
                    legends={[
                        {
                            anchor: "bottom-right",
                            direction: "column",
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: "left-to-right",
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: "circle",
                            symbolBorderColor: "rgba(0, 0, 0, .5)",
                            effects: [
                                {
                                    on: "hover",
                                    style: {
                                        itemBackground: "rgba(255, 255, 255, .1)",
                                        itemOpacity: 1,
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default TickeDistribution;