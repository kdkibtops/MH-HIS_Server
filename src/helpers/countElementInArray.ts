/**Function to count element occurence in an Array
 * returns the number of occurence of the given element in the array
 */
const countElementInArray = (arr: [], ele: string | number | boolean) => {
	let occurence = 0;
	arr.forEach((e) => {
		if (e === ele) {
			occurence++;
		}
	});
	return occurence;
};
export default countElementInArray;
