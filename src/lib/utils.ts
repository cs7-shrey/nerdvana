import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import validator from "validator";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isValidEmail(email: string) {
	return validator.isEmail(email);
}

export function isValidPassword(password: string) {
	return validator.isStrongPassword(password, {
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	});
}
