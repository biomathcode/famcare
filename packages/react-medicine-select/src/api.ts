export async function fetchMedicines(query: string) {
    if (!query) return [];
    const res = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${encodeURIComponent(
            query
        )}&maxList=20`
    );
    const data = await res.json();
    // data[1] = array of names
    return data[1] as string[];
}