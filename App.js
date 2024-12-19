import { Canvas, useImage, Image, Group, Text, FontWeight, matchFont } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { Easing, Extrapolation, interpolate, runOnJS, useAnimatedReaction, useDerivedValue, useFrameCallback, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

const GRAVITY = 1000;
const JUMP_FORCE = -500;

const App = () => {
	const { width, height } = useWindowDimensions();
	const [score, setScore] = useState(0);
	const bg = useImage(require("./assets/sprites/background-day.png"));
	const bird = useImage(require("./assets/sprites/yellowbird-upflap.png"));
	const pipeUp = useImage(require("./assets/sprites/pipe-green - inverted.png"));
	const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
	const base = useImage(require("./assets/sprites/base.png"));

	const pipeOffset = 0;

	const x = useSharedValue(width);

	const birdY = useSharedValue(height / 3);
	const birdPos = {
		x: width / 4,
	};
	const birdYVelocity = useSharedValue(0);

	useEffect(() => {
		x.value = withRepeat(withSequence(withTiming(-200, { duration: 3000, easing: Easing.linear }), withTiming(width)), -1);
	}, []);

	useAnimatedReaction(
		() => {
			return x.value;
		},
		(currentValue, previousValue) => {
			const middle = birdPos.x;
			if (previousValue && currentValue !== previousValue && currentValue <= middle && previousValue > middle) {
				runOnJS(setScore)(score + 1);
			}
		}
	);

	useFrameCallback(({ timeSincePreviousFrame: dt }) => {
		if (!dt) {
			return;
		}

		birdY.value = birdY.value + (birdYVelocity * dt) / 1000;
		birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000;
	});

	const gesture = Gesture.Tap().onStart(() => {
		birdYVelocity.value = JUMP_FORCE;
	});

	const birdTransform = useDerivedValue(() => {
		return [{ rotate: interpolate(birdYVelocity.value, [-500, 500], [-0.5, 0.5], Extrapolation.CLAMP) }];
	});
	const birdOrigin = useDerivedValue(() => {
		return { x: width / 4 + 32, y: birdY.value + 24 };
	});

	const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
	const fontStyle = { fontFamily, fontSize: 40, fontWeight: "bold" };
	const font = matchFont(fontStyle);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector gesture={gesture}>
				<Canvas style={{ width, height }}>
					{/*BG*/}
					<Image image={bg} fit={"cover"} width={width} height={height}></Image>

					{/*BIRD*/}
					<Group transform={birdTransform} origin={birdOrigin}>
						<Image image={bird} y={birdY} x={birdPos.x} width={64} height={48}></Image>
					</Group>

					{/*PIPE TOP*/}
					<Image image={pipeUp} y={pipeOffset - 320} x={x} width={103} height={640}></Image>

					{/*PIPE BOTTOM*/}
					<Image image={pipeBottom} y={height - 320 + pipeOffset} x={x} width={103} height={640}></Image>

					{/*BASE*/}
					<Image image={base} y={height - 75} x={0} width={width} height={150} fit={"cover"}></Image>

					{/*Score*/}
					<Text x={width / 2 - 12} y={100} text={score.toString()} font={font}></Text>
				</Canvas>
			</GestureDetector>
		</GestureHandlerRootView>
	);
};
export default App;
