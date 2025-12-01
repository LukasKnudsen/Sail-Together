import { mutate } from "swr";
import { toggleJobFavorite } from "./api";
import type { JobAttributes } from "@/db/types/Job";

export function useToggleJobFavorite(key: string | null) {
    return async function toggle(id: string) {
        if (!key) return;

        await mutate(
            key,
            (current: JobAttributes[] | JobAttributes | null | undefined) => {
                if (!current) return current;

                if (Array.isArray(current)) {
                    return current.map(j =>
                        j.id === id ? { ...j, isFavorite: !j.isFavorite } : j
                    );
                }

                if (current.id !== id) return current;
                return { ...current, isFavorite: !current.isFavorite };
            },
            { revalidate: false }
        );

        try {
            const newStatus = await toggleJobFavorite(id);
            await mutate(
                key,
                (current: JobAttributes[] | JobAttributes | null | undefined) => {
                    if (!current) return current;

                    if (Array.isArray(current)) {
                        return current.map(j =>
                            j.id === id ? { ...j, isFavorite: newStatus } : j
                        );
                    }

                    if (current.id !== id) return current;
                    return { ...current, isFavorite: newStatus };
                },
                { revalidate: false }
            );
        } catch (error) {
            await mutate(key, undefined, { revalidate: true });
        }
    };
}