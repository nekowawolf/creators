'use client';

import NwwOneeAIChat, { chatStore } from "@/components/NwwOneeAIChat";
import { useState, useEffect, useRef, Suspense } from 'react';
import { FaTimes, FaYoutube, FaInstagram, FaGithub, FaDiscord, FaTelegram, FaTiktok, FaGlobe } from 'react-icons/fa';
import { FaXTwitter, FaSquareUpwork } from 'react-icons/fa6';
import { SiFreelancer } from "react-icons/si";
import { TbBrandFiverr } from "react-icons/tb";
import { CgSmileNoMouth, CgClose } from "react-icons/cg";
import { CiBookmark } from "react-icons/ci";
import { Spinner } from '@/components/ui/spinner';
import { FiChevronDown, FiCheck, FiFilter, FiBriefcase } from 'react-icons/fi';
import { IoLanguageOutline } from "react-icons/io5";
import { FallbackImage } from '@/components/FallbackImage';
import Pagination from '@/components/Pagination';
import { useCreators } from '@/hooks/useCreators';

const ITEMS_PER_PAGE = 9;

const categories = ['3D', 'AI', 'All', 'Game Dev', 'Web3', 'Design', 'Artist', 'Editing', 'Audio', 'Gadget', 'Machine Learning', 'Fullstack', 'Cyber Security'];
const languages = ['All', 'EN', 'ID', 'CN', 'JP'];

const socialOrder = ['website', 'youtube', 'twitter', 'instagram', 'discord', 'telegram', 'github', 'tiktok', 'fiverr', 'upwork', 'peopleperhour', 'freelancer'];

function FilterDropdown({ selectedLanguage, setSelectedLanguage, open_to_workOnly, setOpenToWorkOnly }: { selectedLanguage: string, setSelectedLanguage: (lang: string) => void, open_to_workOnly: boolean, setOpenToWorkOnly: (val: boolean) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hasActiveFilters = selectedLanguage !== 'All' || open_to_workOnly;

    return (
        <div className="relative inline-block text-left shrink-0" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-center gap-2 px-4 h-12 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer
                    ${isOpen || hasActiveFilters ? 'bg-blue-500/20 text-fill-color border border-blue-500/50' : 'card-color text-fill-color/70 border border-color hover:!text-[var(--fill-color)] hover:!border-blue-600'}
                `}
            >
                <FiFilter className={`w-4 h-4 ${isOpen || hasActiveFilters ? 'text-blue-400' : ''}`} />
                <span>Filter</span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-56 rounded-xl card-color border border-color shadow-xl overflow-hidden focus:outline-none animate-in fade-in zoom-in-95 duration-200 right-0 origin-top-right">
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar px-3 pb-3 pt-5">
                        <div className="mb-4">
                            <div className="flex items-center gap-1.5 mb-2 px-2 text-fill-color/50">
                                <FiBriefcase className="w-3.5 h-3.5" />
                                <h3 className="text-xs font-semibold uppercase tracking-wider">Status</h3>
                            </div>
                            <div className="space-y-1">
                                <button
                                    onClick={() => {
                                        setOpenToWorkOnly(!open_to_workOnly);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${open_to_workOnly
                                            ? 'bg-blue-500/20 text-blue-400 font-medium'
                                            : 'text-fill-color/70 hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>Open to Work</span>
                                    </div>
                                    {open_to_workOnly && <FiCheck className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5 mb-2 px-2 text-fill-color/50">
                                <IoLanguageOutline className="w-3.5 h-3.5" />
                                <h3 className="text-xs font-semibold uppercase tracking-wider">Language</h3>
                            </div>
                            <div className="space-y-1">
                                {languages.map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => {
                                            setSelectedLanguage(lang);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${selectedLanguage === lang
                                                ? 'bg-blue-500/20 text-blue-400 font-medium'
                                                : 'text-fill-color/70 hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{lang === 'All' ? 'All Languages' : lang}</span>
                                        </div>
                                        {selectedLanguage === lang && <FiCheck className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <NwwOneeAIChat />
        </div>
    );
}

function CreatorsContentInner() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    const [open_to_workOnly, setOpenToWorkOnly] = useState(false);

    const { creatorsData, loading, error } = useCreators();

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCreator, setSelectedCreator] = useState<any | null>(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, activeCategory, selectedLanguage, open_to_workOnly]);

    const filteredCreators = creatorsData.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
        const matchesLanguage = selectedLanguage === 'All' || c.language === selectedLanguage;
        const matchesOpenToWork = !open_to_workOnly || c.open_to_work === true;
        return matchesSearch && matchesCategory && matchesLanguage && matchesOpenToWork;
    });

    const totalItems = filteredCreators.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const displayedCreators = filteredCreators.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderSocialIcon = (key: string, url: string) => {
        switch (key) {
            case 'youtube': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaYoutube className="w-5 h-5" /></a>;
            case 'twitter': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaXTwitter className="w-5 h-5" /></a>;
            case 'instagram': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaInstagram className="w-5 h-5" /></a>;
            case 'github': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaGithub className="w-5 h-5" /></a>;
            case 'discord': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaDiscord className="w-5 h-5" /></a>;
            case 'telegram': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaTelegram className="w-5 h-5" /></a>;
            case 'tiktok': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaTiktok className="w-5 h-5" /></a>;
            case 'website': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaGlobe className="w-5 h-5" /></a>;
            case 'fiverr': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><TbBrandFiverr className="w-5 h-5" /></a>;
            case 'upwork': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><FaSquareUpwork className="w-5 h-5" /></a>;
            case 'peopleperhour': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><CgSmileNoMouth className="w-5 h-5 scale-110" /></a>;
            case 'freelancer': return <a key={key} href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity text-fill-color"><SiFreelancer className="w-5 h-5 scale-125" /></a>;
            default: return null;
        }
    };

    const getOrderedSocials = (socialsObj: any) => {
        const presentSocials = Object.keys(socialsObj).filter(k => socialsObj[k] && typeof socialsObj[k] === 'string');

        return presentSocials.sort((a, b) => {
            const indexA = socialOrder.indexOf(a);
            const indexB = socialOrder.indexOf(b);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        }).map(key => ({ key, url: socialsObj[key] }));
    };

    const scrollRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollRef.current && fadeRef.current) {
                const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
                const hasMore = Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1;
                fadeRef.current.style.opacity = hasMore ? '1' : '0';
                fadeRef.current.style.visibility = hasMore ? 'visible' : 'hidden';
            }
        };

        const timeoutId = setTimeout(checkOverflow, 50);
        
        window.addEventListener('resize', checkOverflow);
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', checkOverflow);
        }
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkOverflow);
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', checkOverflow);
            }
        };
    }, [categories.length]);

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        if (scrollRef.current) {
            setStartX(e.pageX - scrollRef.current.offsetLeft);
            setScrollLeft(scrollRef.current.scrollLeft);
        }
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX);
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="min-h-screen body-color text-fill-color p-8 pt-12 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="w-full max-w-2xl mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        Creators Directory
                    </h1>
                    <p className="text-fill-color/70 max-w-md mx-auto">
                        Explore our curated list of tech content creators. Filter by niche or language to find exactly what you're looking for.
                    </p>
                </div>

                {/* Search Bar & Language Filter */}
                <div className="w-full max-w-2xl mb-6 flex gap-3">
                    <div className="relative flex-grow">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-fill-color/50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search Content Creator"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-12 pl-12 pr-12 rounded-full card-color border border-color focus:outline-none focus:border-blue-500 text-fill-color placeholder:text-fill-color/50 transition-colors"
                        />
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setCurrentPage(1);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity text-fill-color cursor-pointer"
                                aria-label="Clear search"
                            >
                                <CgClose className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <FilterDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} open_to_workOnly={open_to_workOnly} setOpenToWorkOnly={setOpenToWorkOnly} />
                </div>

                {/* Categories Buttons */}
                <div className="relative w-full md:max-w-3xl mb-10 mx-auto overflow-hidden">
                    <div 
                        ref={scrollRef}
                        onMouseDown={onMouseDown}
                        onMouseLeave={onMouseLeave}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        className={`flex overflow-x-auto gap-2 items-center md:pb-3 max-md:[&::-webkit-scrollbar]:hidden max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(var(--fill-color-rgb),0.3)] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[rgba(var(--fill-color-rgb),0.5)] ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium leading-none transition-colors duration-200 cursor-pointer ${
                                    activeCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'card-color text-fill-color/70 border border-color hover:!text-[var(--fill-color)] hover:!border-blue-600'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    {/* Fade indicator */}
                    <div 
                        ref={fadeRef}
                        className="absolute right-0 top-0 h-8 w-12 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: 0, visibility: 'hidden' }}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center p-12 w-full max-w-7xl">
                        <Spinner className="text-blue-500 size-10" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full items-center">
                        {error && (
                            <div className="text-red-500 text-center py-4 bg-red-500/10 rounded-lg border border-red-500/20 w-full max-w-7xl mb-4">
                                Error loading creators: {error}
                            </div>
                        )}
                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full max-w-7xl">
                            {displayedCreators.length > 0 ? (
                                displayedCreators.map(creator => {
                                    const socialKeys = { website: creator.website, ...creator.socials, ...creator.platforms };
                                    const orderedSocials = getOrderedSocials(socialKeys);

                                    return (
                                        <div
                                            key={creator._id}
                                            onClick={() => setSelectedCreator(creator)}
                                            className="glass-card rounded-2xl p-5 flex flex-col h-full card-hover transition-all cursor-pointer relative"
                                        >
                                            <div className="flex gap-4 mb-4">
                                                <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-card-color shrink-0 border border-color shadow-sm">
                                                    <FallbackImage
                                                        src={creator.image_url}
                                                        alt={creator.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>

                                                <div className="flex flex-col flex-grow min-w-0 justify-center py-0.5">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-lg font-bold text-fill-color leading-tight truncate">
                                                            {creator.name}
                                                        </h3>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                chatStore.setIsOpen(true);
                                                                chatStore.setActiveView('user');
                                                            }}
                                                            className="cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color shrink-0"
                                                            title="Bookmark"
                                                        >
                                                            <CiBookmark className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                            {creator.category}
                                                        </span>
                                                        {creator.open_to_work && (
                                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold leading-none shrink-0">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                                                                <span>OPEN TO WORK</span>
                                                            </span>
                                                        )}
                                                        <span className="text-xs px-2 py-0.5 rounded-md border border-color bg-card-color text-fill-color/70 font-bold">
                                                            {creator.language}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-fill-color/70 mb-4 flex-grow line-clamp-3">
                                                {creator.description}
                                            </p>

                                            <div className="flex items-center gap-4 mt-auto pt-4">
                                                {orderedSocials.map(social => renderSocialIcon(social.key, social.url))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full w-full flex-col flex gap-4">
                                    <div className="text-center py-1">
                                        <FallbackImage
                                            src="https://cdn.nekowawolf.xyz/image/2026/1787422427_nwwonee_search.webp"
                                            alt="No data found"
                                            width={160}
                                            height={160}
                                            className="mx-auto"
                                        />
                                        <p className="text-fill-color/50 -mt-4">No data available.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {displayedCreators.length > 0 && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                itemsPerPage={ITEMS_PER_PAGE}
                                totalItems={totalItems}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                )}

                {/* Modal Popup */}
                {selectedCreator && (
                    <div
                        className="cursor-pointer fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setSelectedCreator(null)}
                    >
                        <div
                            className="cursor-auto glass-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-color shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedCreator(null)}
                                className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity text-fill-color z-10"
                            >
                                <FaTimes size={20} />
                            </button>

                            <div className="p-6 sm:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-card-color2 shrink-0 border border-color shadow-sm">
                                        <FallbackImage
                                            src={selectedCreator.image_url}
                                            alt={selectedCreator.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 pr-8">
                                            <h2 className="text-2xl font-bold text-fill-color leading-tight">
                                                {selectedCreator.name}
                                            </h2>
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    chatStore.setIsOpen(true);
                                                    chatStore.setActiveView('user');
                                                }}
                                                className="cursor-pointer opacity-70 hover:opacity-100 transition-all text-fill-color shrink-0"
                                                title="Bookmark"
                                            >
                                                <CiBookmark className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {selectedCreator.category}
                                            </span>
                                            {selectedCreator.open_to_work && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold leading-none">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                                                    <span>OPEN TO WORK</span>
                                                </span>
                                            )}
                                            <span className="text-xs px-2 py-0.5 rounded-md border border-color bg-card-color text-fill-color/70 font-bold">
                                                {selectedCreator.language}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-fill-color/50 mb-2 uppercase tracking-wider">About</h4>
                                    <div className="max-h-40 overflow-y-auto pr-2">
                                        <p className="text-base text-fill-color/80 leading-relaxed whitespace-pre-wrap">
                                            {selectedCreator.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 pt-6 mt-auto">
                                    {(() => {
                                        const socialKeys = { website: selectedCreator.website, ...selectedCreator.socials, ...selectedCreator.platforms };
                                        const orderedSocials = getOrderedSocials(socialKeys);
                                        return orderedSocials.map(social => renderSocialIcon(social.key, social.url));
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CreatorsContent() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner className="text-blue-500 size-10" />
            </div>
        }>
            <CreatorsContentInner />
        </Suspense>
    );
}