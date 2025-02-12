// Parsing format DD-MM-YYYY to YYYY-MM-DD
const formatDate = (date) => {
	const splittedDate = date.split("-");
	return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
}
export {formatDate}