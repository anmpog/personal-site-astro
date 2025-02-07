export default function removeDuplicates(arr, key) {
  return [...new Map(arr.map(val => [val[key], val])).values()]
}
