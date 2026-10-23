export interface GroupInfo {
	id: string;
	name: string;
	color: string;
	text: string;
}

export const CHILD_GROUPS: GroupInfo[] = [
	{ id: "3", name: "3. oddíl", color: "#36802D", text: "#ffffff" },
	{ id: "4", name: "4. oddíl", color: "#3880ff", text: "#ffffff" },
	{ id: "5", name: "5. oddíl", color: "#BB0000", text: "#ffffff" },
	{ id: "6", name: "6. oddíl", color: "#36802D", text: "#ffffff" },
	{ id: "7", name: "7. oddíl", color: "#3880ff", text: "#ffffff" },
	{ id: "8", name: "8. oddíl", color: "#FEC503", text: "#1d2452" },
	{ id: "22", name: "22. oddíl", color: "#FEC503", text: "#1d2452" },
];

export const FRIENDS_CLUB: GroupInfo = { id: "KP", name: "Klub přátel", color: "#e28f26", text: "#2a3478" };

export function groupInfo(id: string): GroupInfo {
	return (
		CHILD_GROUPS.find((group) => group.id === id) ??
		(id === FRIENDS_CLUB.id ? FRIENDS_CLUB : { id, name: id, color: "#5a6292", text: "#ffffff" })
	);
}
