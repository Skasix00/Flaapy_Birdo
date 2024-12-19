import { Canvas, useImage, Image, Group } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { Easing, Extrapolation, interpolate, useDerivedValue, useFrameCallback, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

const GRAVITY = 1000;
const JUMP_FORCE = -500;

const App = () => {
	const { width, height } = useWindowDimensions();
	const bg = useImage(require("./assets/sprites/background-day.png"));
	const bird = useImage(require("./assets/sprites/yellowbird-upflap.png"));
	const pipeUp = useImage(require("./assets/sprites/pipe-green - inverted.png"));
	const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
	const base = useImage(require("./assets/sprites/base.png"));

	const pipeOffset = 0;

	const x = useSharedValue(width);

	const birdY = useSharedValue(height / 3);
	const birdYVelocity = useSharedValue(0);
	const birdTransform = useDerivedValue(() => {
		return [{ rotate: interpolate(birdYVelocity.value, [-500, 500], [-0.5, 0.5], Extrapolation.CLAMP) }];
	});
	const birdOrigin = useDerivedValue(() => {
		return { x: width / 4 + 32, y: birdY.value + 24 };
	});

	useFrameCallback(({ timeSincePreviousFrame: dt }) => {
		if (!dt) {
			return;
		}

		birdY.value = birdY.value + (birdYVelocity * dt) / 1000;
		birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000;
	});

	useEffect(() => {
		x.value = withRepeat(withSequence(withTiming(-200, { duration: 3000, easing: Easing.linear }), withTiming(width)), -1);
	}, []);

	const gesture = Gesture.Tap().onStart(() => {
		birdYVelocity.value = JUMP_FORCE;
	});

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector gesture={gesture}>
				<Canvas style={{ width, height }}>
					{/*BG*/}
					<Image image={bg} fit={"cover"} width={width} height={height}></Image>

					{/*BIRD*/}
					<Group transform={birdTransform} origin={birdOrigin}>
						<Image image={bird} y={birdY} x={width / 4} width={64} height={48}></Image>
					</Group>

					{/*PIPE TOP*/}
					<Image image={pipeUp} y={pipeOffset - 320} x={x} width={103} height={640}></Image>

					{/*PIPE BOTTOM*/}
					<Image image={pipeBottom} y={height - 320 + pipeOffset} x={x} width={103} height={640}></Image>

					{/*BASE*/}
					<Image image={base} y={height - 75} x={0} width={width} height={150} fit={"cover"}></Image>
				</Canvas>
			</GestureDetector>
		</GestureHandlerRootView>
	);
};
export default App;
