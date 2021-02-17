import React from 'react';

interface InputProps {
	errors?: any
	name: string
	label: string
	value?: any
	type?: string
	disabled?: boolean
}


const Input = React.forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
	return (
		<div className="mt4">
			<label className="db fw6 lh-copy f6" htmlFor={props.name}>{props.label}</label>
			<input
				className="pa2 input-reset ba bg-transparent hover-bg-light-gray hover-black w-100"
				type={props.type || 'text'}
				name={props.name}
				id={props.name}
				ref={ref}
				disabled={!!props.disabled}
			/>
			{props.errors && <span>This field is required</span>}
		</div>
	);
});

export default Input;
