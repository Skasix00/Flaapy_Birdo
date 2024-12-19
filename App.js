import { Canvas, useImage, Image } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { Easing, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
const App = () => {
	const { width, height } = useWindowDimensions();
	const bg = useImage(require("./assets/sprites/background-day.png"));
	const bird = useImage(require("./assets/sprites/yellowbird-upflap.png"));
	const pipeUp = useImage(require("./assets/sprites/pipe-green - inverted.png"));
	const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
	const base = useImage(require("./assets/sprites/base.png"));

	const pipeOffset = 0;
	const x = useSharedValue(width - 50);

	useEffect(() => {
		x.value = withRepeat(
			withSequence(
				withTiming(-200, { duration: 3000, easing: Easing.linear })
				, withTiming(width)
			),
			-1
		);
	}, []);

	return (
		<Canvas style={{ width, height }}>
			{/*BG*/}
			<Image image={bg} fit={"cover"} width={width} height={height}></Image>

			{/*BIRD*/}
			<Image image={bird} y={height / 2 - 24} x={width / 4} width={64} height={48}></Image>

			{/*PIPE TOP*/}
			<Image image={pipeUp} y={pipeOffset - 320} x={x} width={103} height={640}></Image>

			{/*PIPE BOTTOM*/}
			<Image image={pipeBottom} y={height - 320 + pipeOffset} x={x} width={103} height={640}></Image>

			{/*BASE*/}
			<Image image={base} y={height - 75} x={0} width={width} height={150} fit={"cover"}></Image>
		</Canvas>
	);
};
export default App;
