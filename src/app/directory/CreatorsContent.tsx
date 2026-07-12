'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import creatorsData from '@/data/creators.json';
import { FaTimes, FaYoutube, FaInstagram, FaGithub, FaDiscord, FaTelegram, FaTiktok, FaGlobe } from 'react-icons/fa';
import { FaXTwitter, FaSquareUpwork } from 'react-icons/fa6';
import { SiFreelancer } from "react-icons/si";
import { TbBrandFiverr } from "react-icons/tb";
import { CgSmileNoMouth } from "react-icons/cg";
import { Spinner } from '@/components/ui/spinner';
import { FiChevronDown, FiCheck, FiFilter, FiBriefcase } from 'react-icons/fi';
import { IoLanguageOutline } from "react-icons/io5";
import { FallbackImage } from '@/components/FallbackImage';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 9;

const categories = ['3D', 'AI', 'All', 'Game Dev', 'Web3', 'Design', 'Artist', 'Editing', 'Audio', 'Gadget', 'Machine Learning', 'Fullstack', 'Cyber Security'];
const languages = ['All', 'EN', 'ID', 'CN', 'JP'];

const socialOrder = ['website', 'youtube', 'twitter', 'instagram', 'discord', 'telegram', 'github', 'tiktok', 'fiverr', 'upwork', 'peopleperhour', 'freelancer'];

function FilterDropdown({ selectedLanguage, setSelectedLanguage, openToWorkOnly, setOpenToWorkOnly }: { selectedLanguage: string, setSelectedLanguage: (lang: string) => void, openToWorkOnly: boolean, setOpenToWorkOnly: (val: boolean) => void }) {
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

    const hasActiveFilters = selectedLanguage !== 'All' || openToWorkOnly;

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
                                        setOpenToWorkOnly(!openToWorkOnly);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${openToWorkOnly
                                            ? 'bg-blue-500/20 text-blue-400 font-medium'
                                            : 'text-fill-color/70 hover:bg-[rgba(var(--fill-color-rgb),0.1)] hover:text-fill-color'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>Open to Work</span>
                                    </div>
                                    {openToWorkOnly && <FiCheck className="w-4 h-4" />}
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
        </div>
    );
}

function CreatorsContentInner() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    const [openToWorkOnly, setOpenToWorkOnly] = useState(false);

    const [loading, setLoading] = useState(true);

    const [toolsData, setToolsData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCreator, setSelectedCreator] = useState<any | null>(null);

    useEffect(() => {
        const loadData = () => {
            setLoading(true);
            let resultData = [...creatorsData];
            for (let i = resultData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [resultData[i], resultData[j]] = [resultData[j], resultData[i]];
            }
            setToolsData(resultData);
            setTimeout(() => setLoading(false), 500);
        };
        loadData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, activeCategory, selectedLanguage, openToWorkOnly]);

    const filteredCreators = toolsData.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
        const matchesLanguage = selectedLanguage === 'All' || c.language === selectedLanguage;
        const matchesOpenToWork = !openToWorkOnly || c.openToWork === true;
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
                            className="w-full h-12 pl-12 pr-6 rounded-full card-color border border-color focus:outline-none focus:border-blue-500 text-fill-color placeholder:text-fill-color/50 transition-colors"
                        />
                    </div>
                    <FilterDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} openToWorkOnly={openToWorkOnly} setOpenToWorkOnly={setOpenToWorkOnly} />
                </div>

                {/* Categories Buttons */}
                <div className="relative w-full md:max-w-3xl mb-10 mx-auto">
                    <div className="flex overflow-x-auto md:flex-wrap gap-2 md:justify-center items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                    {/* Mobile fade indicator */}
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none md:hidden" />
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex justify-center p-12 w-full max-w-7xl">
                        <Spinner className="text-blue-500 size-10" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full items-center">
                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full max-w-7xl">
                            {displayedCreators.length > 0 ? (
                                displayedCreators.map(creator => {
                                    const { id, name, description, imageUrl, category, language, ...socialKeys } = creator;
                                    const orderedSocials = getOrderedSocials(socialKeys);

                                    return (
                                        <div
                                            key={creator.id}
                                            onClick={() => setSelectedCreator(creator)}
                                            className="glass-card rounded-2xl p-5 flex flex-col h-full card-hover transition-all cursor-pointer relative"
                                        >
                                            <div className="flex gap-4 mb-4">
                                                <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-card-color shrink-0 border border-color shadow-sm">
                                                    <FallbackImage
                                                        src={creator.imageUrl}
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
                                                    </div>
                                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                            {creator.category}
                                                        </span>
                                                        {creator.openToWork && (
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
                                    <div className="text-center py-10">
                                        <FallbackImage
                                            src="https://nekowawolf.github.io/cdn-images/images/2026/1771661079_pixchan.png"
                                            alt="No data found"
                                            width={176}
                                            height={176}
                                            className="mx-auto"
                                        />
                                        <p className="text-fill-color/50 mt-4">No data available.</p>
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
                                            src={selectedCreator.imageUrl}
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
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {selectedCreator.category}
                                            </span>
                                            {selectedCreator.openToWork && (
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
                                        const { id, name, description, imageUrl, category, language, ...socialKeys } = selectedCreator;
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