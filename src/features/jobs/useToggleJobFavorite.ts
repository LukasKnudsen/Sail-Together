import { mutate } from "swr";
import { toggleJobFavorite } from "./api";
import type { JobAttributes } from "@/db/types/Job";

export function useToggleJobFavorite(key: string | null) {
    return async function toggle(id: string) {
        if (!key) return;

        await mutate(
            key,
            async (
                current: JobAttributes[] | JobAttributes | null | undefined
            ): Promise<typeof current> => {
                if (!current) return current;

                if (Array.isArray(current)) {
                    const optimistic = current.map(j =>
                        j.id === id ? { ...j, isFavorite: !j.isFavorite } : j
                    );
                    try {
                        const newStatus = await toggleJobFavorite(id);
                        return optimistic.map(j =>
                            j.id === id ? { ...j, isFavorite: newStatus } : j
                        );
                    } catch {
                        return current;
                    }
                }

                if (current.id !== id) return current;
                const optimisticSingle = { ...current, isFavorite: !current.isFavorite };
                try {
                    const newStatus = await toggleJobFavorite(id);
                    return { ...optimisticSingle, isFavorite: newStatus };
                } catch {
                    return current;
                }
            },
            { revalidate: false }
        );
    };
}