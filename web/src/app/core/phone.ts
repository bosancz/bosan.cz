export function formatPhone(phone: string): string {
	const digits = phone.replace(/\D/g, "").replace(/^(00)?420(?=\d{9}$)/, "");
	return digits.length === 9 ? digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") : phone.trim();
}

export function phoneHref(phone: string): string {
	const digits = phone.replace(/[^\d+]/g, "");
	return "tel:" + (/^\d{9}$/.test(digits) ? "+420" + digits : digits.replace(/^00/, "+"));
}
