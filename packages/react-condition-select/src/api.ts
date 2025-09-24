export async function fetchConditions(query: string) {
    if (!query) return [];
    const res = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${encodeURIComponent(
            query
        )}&maxList=20`
    );
    const data = await res.json();
    return (data[3] || []).map((item: string[]) => item[0]);
}