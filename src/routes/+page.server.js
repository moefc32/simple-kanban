import Backlogs, { enums } from '$lib/server/db/model/backlogs';

export async function load({ parent }) {
    const { userData } = await parent();

    if (!userData) return;

    const items = Object.fromEntries(
        enums.status.map((s) => [s.value, []])
    );

    const result = await Backlogs.find({
        user_id: userData._id,
    })
        .select('title urgency status due_time')
        .sort({ status: 1, urgency: 1 })
        .lean();

    const sortedResult = result
        .map((item) => ({
            ...item,
            _id: item._id.toString(),
        }))
        .sort((a, b) => {
            return enums.urgency.findIndex((u) => u.value === a.urgency)
                - enums.urgency.findIndex((u) => u.value === b.urgency);
        });

    for (const item of sortedResult) {
        const status = item.status || enums.status[0].value;

        if (items[status]) {
            items[status].push(item);
        } else {
            items.TODO.push(item);
        }
    }

    return {
        pageTitle: '',
        userData,
        contents: items,
        enums,
    };
}
