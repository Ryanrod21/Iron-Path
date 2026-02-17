import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { BicepsFlexed, Footprints } from "lucide-react";
import Button from "../button";

import { supabase } from "../../lib/supabaseClient";
import { fetchGymData, handleGymSave } from "../../utils/userChartData";

export default function Chart({ history, user }) {
	const [goalWeight, setGoalWeight] = useState(null);
	const [weightEnter, setWeightEnter] = useState("");
	const [weightHistory, setWeightHistory] = useState([]);
	const [isEdit, setIsEdit] = useState("");
	const [activeTab, setActiveTab] = useState("progress");

	const [mileHistory, setMileHistory] = useState([]);
	const [mileEnter, setMileEnter] = useState("");
	const [goalMile, setGoalMile] = useState(null);

	useEffect(() => {
		const loadData = async () => {
			if (!user?.id) return;

			const data = await fetchGymData({ supabase, userId: user.id });
			if (!data) return;

			setWeightHistory(data.weight_progress || []);
			setMileHistory(data.miles_progress || []);
			setGoalWeight(data.weight_goal ?? null);
			setGoalMile(data.miles_goal ?? null);
		};

		loadData();
	}, [user?.id]);

	useEffect(() => {
		setIsEdit("");
	}, [activeTab]);

	if (!history || history.length === 0) {
		return <p>No workout data yet</p>;
	}

	/* -------------------- LABELS -------------------- */

	const labels = weightHistory.map((entry) =>
		new Date(entry.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		}),
	);

	const mileLabels = mileHistory.map((entry) =>
		new Date(entry.date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		}),
	);

	/* -------------------- HIGHCHARTS OPTIONS -------------------- */

	const visiblePoints = 10;
	const lastIndex = labels.length - 1;

	const weightChartOptions = {
		chart: {
			type: "line",
			backgroundColor: "transparent",
			panning: true,
		},
		title: {
			text: "Weight Progress",
			style: { color: "white" },
		},
		xAxis: {
			categories: labels,
			labels: { style: { color: "white" } },
			min: Math.max(lastIndex - (visiblePoints - 1), 0),
			max: lastIndex,
			scrollbar: {
				enable: true,
			},
		},
		yAxis: {
			min: 0,
			max: 600,
			title: {
				text: "Weight (lbs)",
				style: { color: "white" },
			},
			labels: { style: { color: "white" } },
		},
		legend: {
			itemStyle: { color: "white" },
		},
		series: [
			{
				name: "Weight",
				data: weightHistory.map((e) => e.weight),
				color: "rgb(41, 208, 238)",
			},
			{
				name: "Target Weight",
				data: labels.map(() => goalWeight),
				dashStyle: "Dash",
				color: "red",
			},
		],
	};

	const visiblePointsMiles = 10;
	const lastIndexMiles = mileLabels.length - 1;

	const milesChartOptions = {
		chart: {
			type: "line",
			backgroundColor: "transparent",
			panning: true,
		},
		title: {
			text: "Miles Progress",
			style: { color: "white" },
		},
		xAxis: {
			categories: mileLabels,
			labels: { style: { color: "white" } },
			min: Math.max(lastIndexMiles - (visiblePointsMiles - 1), 0),
			max: lastIndexMiles,
			scrollbar: {
				enable: true,
			},
		},
		yAxis: {
			min: 0,
			max: 50,
			title: {
				text: "Miles",
				style: { color: "white" },
			},
			labels: { style: { color: "white" } },
		},
		legend: {
			itemStyle: { color: "white" },
		},
		series: [
			{
				name: "Miles Completed",
				data: mileHistory.map((e) => e.miles),
				color: "rgb(0, 255, 4)",
			},
			{
				name: "Target Miles",
				data: mileLabels.map(() => goalMile),
				dashStyle: "Dash",
				color: "red",
			},
		],
	};

	/* -------------------- SAVE HANDLER -------------------- */

	const handleSave = (type) => {
		handleGymSave({
			type,
			supabase,
			user,
			weightEnter,
			setWeightEnter,
			setWeightHistory,
			mileEnter,
			setMileEnter,
			setMileHistory,
			goalWeight,
			setGoalWeight,
			goalMile,
			setGoalMile,
			setIsEdit,
		});
	};

	return (
		<div className="chart-container">
			<div className="tabs">
				<button
					className={`tabs-btn ${activeTab === "progress" ? "active" : ""}`}
					onClick={() => setActiveTab("progress")}
				>
					Weekly Progress <BicepsFlexed />
				</button>

				<button
					className={`tabs-btn ${activeTab === "run" ? "active" : ""}`}
					onClick={() => setActiveTab("run")}
				>
					Running Progress <Footprints />
				</button>
			</div>

			{activeTab === "progress" && (
				<>
					<div style={{ paddingBottom: "20px" }}>
						<h1>Weight Table</h1>
					</div>

					<HighchartsReact
						highcharts={Highcharts}
						options={weightChartOptions}
					/>
				</>
			)}

			{activeTab === "run" && (
				<>
					<div style={{ paddingBottom: "20px" }}>
						<h1>Miles Table</h1>
					</div>

					<HighchartsReact
						highcharts={Highcharts}
						options={milesChartOptions}
					/>
				</>
			)}

			<div className="goals-footer">
				{activeTab === "progress" && (
					<>
						{!isEdit ? (
							<>
								<p>Target Weight: {goalWeight}</p>
								<Button
									onClick={() => setIsEdit("goal")}
									label="Set Goal Weight"
								/>

								<p>Enter Weekly Weight:</p>
								<Button
									onClick={() => setIsEdit("weekly")}
									label="Add Weekly Weight"
								/>
							</>
						) : isEdit === "goal" ? (
							<>
								<input
									type="number"
									min={0}
									max={500}
									value={goalWeight ?? ""}
									onChange={(e) => setGoalWeight(Number(e.target.value))}
								/>
								<Button
									onClick={() => handleSave("weight_goal")}
									label="Save"
								/>
								<Button onClick={() => setIsEdit("")} label="Cancel" />
							</>
						) : (
							<>
								<input
									type="number"
									min={0}
									max={500}
									value={weightEnter}
									onChange={(e) => setWeightEnter(Number(e.target.value))}
								/>
								<Button
									onClick={() => handleSave("weight_progress")}
									label="Save"
								/>
								<Button onClick={() => setIsEdit("")} label="Cancel" />
							</>
						)}
					</>
				)}

				{activeTab === "run" && (
					<>
						{!isEdit ? (
							<>
								<p>Target Mile: {goalMile}</p>
								<Button
									onClick={() => setIsEdit("miles")}
									label="Set Mile Goal"
								/>
								<Button
									onClick={() => setIsEdit("weekly")}
									label="Add Your Miles"
								/>
							</>
						) : isEdit === "miles" ? (
							<>
								<input
									type="number"
									min={0}
									max={500}
									value={goalMile ?? ""}
									onChange={(e) => setGoalMile(Number(e.target.value))}
								/>
								<Button onClick={() => handleSave("miles_goal")} label="Save" />
								<Button onClick={() => setIsEdit("")} label="Cancel" />
							</>
						) : (
							<>
								<input
									type="number"
									min={0}
									max={500}
									value={mileEnter}
									onChange={(e) => setMileEnter(Number(e.target.value))}
								/>
								<Button
									onClick={() => handleSave("miles_progress")}
									label="Save"
								/>
								<Button onClick={() => setIsEdit("")} label="Cancel" />
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
