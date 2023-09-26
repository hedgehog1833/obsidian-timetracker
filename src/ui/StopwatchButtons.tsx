import React, { useState } from 'react';

interface StopwatchButtonsProps {}

export const StopwatchButtons = (props: StopwatchButtonsProps) => {
	const [someText, setSomeText] = useState('someDefaultText');

	const handleClick = (): void => {};

	return (
		<div>
			<button onClick={handleClick} className={'start-stop'}>
				Start-Stop-Test-Stuff
			</button>
		</div>
	);
};
