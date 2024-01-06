import { Canvas } from "@react-three/fiber";
import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
	return (
		<Canvas camera={{ fov: 200 }}>
			{/* <OrthographicCamera makeDefault> */}
			<ambientLight color={0xffffff} intensity={Math.PI / 2} />
			{children}
			{/* </OrthographicCamera> */}
		</Canvas>
	);
}
