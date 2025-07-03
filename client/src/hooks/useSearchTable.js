export default function useSearchTable(data, searchQuery) {

    const filteredData = data.filter((item) => {
        return Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
    })

    return filteredData;
}