
export function formatCurrency(c: number, precision = 0) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: precision,
		minimumFractionDigits: precision,
	}).format(c);
}

export function trim(number = 0, precision = 0) {
	// why would number ever be undefined??? what are we trimming?
	const array = number.toString().split(".");
	if (array.length === 1) return number.toString();
	if (precision === 0) return array[0].toString();

	const poppedNumber = array.pop() || "0";
	array.push(poppedNumber.substring(0, precision));
	const trimmedNumber = array.join(".");
	return trimmedNumber;
}

export function setAll(state: any, properties: any) {
	const props = Object.keys(properties);
	props.forEach(key => {
		state[key] = properties[key];
	});
}

export const minutesAgo = (x: number) => {
	const now = new Date().getTime();
	return new Date(now - x * 60000).getTime();
};

export function getQueryParams(search: string): { [key: string]: boolean } {
  const param = new URLSearchParams(search.toString()?.replace("/", ""));
  let custom: { [key: string]: boolean } = {};
  param.forEach(function (value, key) {
    custom[key] = value === "true";
  });
  return custom;
}
