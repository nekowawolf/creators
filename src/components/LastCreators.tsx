'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';
import { FallbackImage } from '@/components/FallbackImage';
import Pagination2 from '@/components/Pagination2';
import { Spinner } from '@/components/ui/spinner';
import { fetchCreators } from '@/services/creatorsService';
import { Creator } from '@/types/creators';

const ITEMS_PER_PAGE = 5;

export default function LastCreators() {
    const [activities, setActivities] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchCreators(false);
                const sortedData = [...data].sort((a, b) => {
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return dateB - dateA;
                });
                setActivities(sortedData);
            } catch (loadError) {
                console.error('Failed to load Creator activity:', loadError);
                setError('Unable to load Creator activity. Please try again later.');
                setActivities([]);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const totalItems = activities.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const displayedActivities = activities.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    return (
        <>
            <div className="w-full mb-12 flex flex-col items-start text-left space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center">
                    /last-added-creator
                </h1>
                <p className="text-fill-color/60 text-sm max-w-full sm:max-w-md leading-relaxed">
                    Latest Creators added to the directory by contributors.{' '}
                    <Link
                        href="/add-creator"
                        className="text-blue-500 hover:text-blue-400 transition-colors font-medium cursor-pointer inline-block mt-1 sm:mt-0"
                    >
                        Add Creator
                    </Link>
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20 w-full">
                    <Spinner className="text-blue-500 size-10" />
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    {error ? (
                        <div className="text-left py-12 text-red-400 font-mono text-sm">
                            {error}
                        </div>
                    ) : displayedActivities.length > 0 ? (
                        <div className="flex flex-col space-y-8 sm:space-y-10 w-full">
                            {displayedActivities.map((creator) => (
                                    <div
                                        key={creator._id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative w-full"
                                    >
                                        <div className="flex items-center gap-3 shrink-0 w-fit min-w-0">
                                            {creator.image_url ? (
                                                <FallbackImage
                                                    src={creator.image_url}
                                                    alt={creator.name}
                                                    className="w-8 h-8 rounded-full object-cover border border-[var(--border-divider)] shrink-0"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                                                    <FaUsers className="w-4 h-4" />
                                                </div>
                                            )}
                                            <span className="text-lg sm:text-xl font-bold text-fill-color tracking-tight truncate max-w-[200px] sm:max-w-[300px]">
                                                {creator.name}
                                            </span>
                                        </div>

                                        <span className="hidden sm:block flex-1 h-px bg-[var(--border-divider)] mx-4" />

                                        <div className="flex items-center justify-start sm:justify-end shrink-0 min-w-0 mt-1 sm:mt-0">
                                            {creator.added_by?.name && (
                                                <div className="flex items-center gap-1.5 text-xs text-fill-color/60 font-mono mr-1.5">
                                                    <span>added by</span>
                                                    {creator.added_by.url ? (
                                                        <a
                                                            href={creator.added_by.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="cursor-pointer font-semibold opacity-70 hover:opacity-100 transition-opacity text-fill-color"
                                                        >
                                                            {creator.added_by.name}
                                                        </a>
                                                    ) : (
                                                        <span className="font-semibold text-fill-color">{creator.added_by.name}</span>
                                                    )}
                                                    {creator.created_at && <span className="text-fill-color/30 hidden sm:inline">·</span>}
                                                </div>
                                            )}

                                            {creator.created_at && (
                                                <span className="text-xs text-fill-color/60 font-mono whitespace-nowrap">
                                                    {new Date(creator.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-left py-12 text-fill-color/50 font-mono text-sm">
                            No activity found.
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination2
                                currentPage={currentPage}
                                itemsPerPage={ITEMS_PER_PAGE}
                                totalItems={totalItems}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}