'use client';

import { useEffect, useRef, useState } from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { toast } from 'sonner';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { LiaTimesCircleSolid } from 'react-icons/lia';
import BackButton from '@/components/BackButton';
import { Spinner } from '@/components/ui/spinner';
import { fetchCreators, submitCreator } from '@/services/creatorsService';

const normalizeUrl = (url: string) => url.trim().toLowerCase().replace(/\/$/, '');

const isValidHttpUrl = (value: string) => {
    try {
        const url = new URL(value);
        return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname);
    } catch {
        return false;
    }
};

export default function AddCreatorClient() {
    const [website, setWebsite] = useState('');
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingUrls, setExistingUrls] = useState<string[]>([]);
    const [isCheckingUrl, setIsCheckingUrl] = useState(false);
    const [urlExists, setUrlExists] = useState<boolean | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const turnstileRef = useRef<TurnstileInstance>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setShowTooltip(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchCreators(false);
                setExistingUrls(
                    data
                        .map((creator) => creator.website)
                        .filter((creatorUrl): creatorUrl is string => Boolean(creatorUrl))
                        .map(normalizeUrl),
                );
            } catch (error) {
                console.error('Failed to load existing Creator data for validation:', error);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        const trimmedWebsite = website.trim();
        if (!trimmedWebsite || !isValidHttpUrl(trimmedWebsite)) return;

        const timer = window.setTimeout(() => {
            setUrlExists(existingUrls.includes(normalizeUrl(trimmedWebsite)));
            setIsCheckingUrl(false);
        }, 600);

        return () => window.clearTimeout(timer);
    }, [website, existingUrls]);

    const websiteError = website.trim() && !isValidHttpUrl(website.trim())
        ? 'Link must be a valid URL starting with https://'
        : null;

    const handleWebsiteChange = (value: string) => {
        setWebsite(value);
        setShowTooltip(false);
        setUrlExists(null);
        setIsCheckingUrl(Boolean(value.trim() && isValidHttpUrl(value.trim())));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const trimmedWebsite = website.trim();
        const trimmedName = name.trim();
        const trimmedLink = link.trim();

        if (!trimmedWebsite) {
            toast.error('Link is required.');
            return;
        }
        if (!isValidHttpUrl(trimmedWebsite)) {
            toast.error('Invalid Link URL format.');
            return;
        }
        if (urlExists || existingUrls.includes(normalizeUrl(trimmedWebsite))) {
            toast.error('This Creator is already listed.');
            return;
        }
        if (!trimmedName) {
            toast.error('Name (Added by) is required.');
            return;
        }
        if (trimmedLink && !isValidHttpUrl(trimmedLink)) {
            toast.error('Invalid Link URL format.');
            return;
        }
        if (!turnstileToken) {
            toast.error('Please verify that you are a human.');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitCreator({
                website: trimmedWebsite,
                name: trimmedName,
                link: trimmedLink,
                turnstile_token: turnstileToken,
            });
            toast.success('Creator submitted successfully.');
            setWebsite('');
            setName('');
            setLink('');
            setTurnstileToken('');
            setUrlExists(null);
            turnstileRef.current?.reset();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to submit Creator');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-grow pt-36 pb-12 min-h-screen body-color text-fill-color px-4 sm:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <BackButton fallbackUrl="/activity" label="Back to Activity" forceFallback />

                <div className="mt-8 mb-12 flex flex-col items-start text-left space-y-2">
                    <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight flex items-center">
                        /add-creator
                    </h1>
                    <p className="text-fill-color/60 text-sm max-w-full sm:max-w-xl leading-relaxed">
                        Know a content creator who belongs here? Submit their official website or profile and help us grow the Creators directory.
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-6 w-full">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                            <label htmlFor="creator-website" className="text-sm font-semibold text-fill-color">
                                Link <span className="text-red-500">*</span>
                            </label>
                            {isCheckingUrl && <Spinner className="w-3.5 h-3.5 text-blue-500" />}
                            {!isCheckingUrl && urlExists !== null && (
                                <div className="relative flex items-center gap-1.5" ref={tooltipRef}>
                                    {urlExists ? (
                                        <LiaTimesCircleSolid className="w-4 h-4 text-red-500" />
                                    ) : (
                                        <FaRegCircleCheck className="w-3.5 h-3.5 text-green-500" />
                                    )}
                                    <button
                                        type="button"
                                        aria-label="Show Link availability details"
                                        onClick={() => setShowTooltip((visible) => !visible)}
                                        className="cursor-pointer text-fill-color/50 hover:text-fill-color transition-colors"
                                    >
                                        <AiOutlineExclamationCircle className="w-4 h-4" />
                                    </button>
                                    {showTooltip && (
                                        <div className="absolute left-0 top-6 w-max max-w-[240px] px-3 py-2 card-color border border-color rounded-lg shadow-lg z-10 text-xs font-medium">
                                            {urlExists ? 'This Creator is already listed.' : 'This Creator is not listed yet.'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <input
                            id="creator-website"
                            type="url"
                            value={website}
                            onChange={(event) => handleWebsiteChange(event.target.value)}
                            placeholder="https://creator.example.com"
                            autoComplete="url"
                            className={`w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border rounded-xl text-fill-color focus:outline-none transition-colors ${
                                websiteError || urlExists === true
                                    ? 'border-red-500/50 focus:border-red-500'
                                    : urlExists === false
                                        ? 'border-green-500/50 focus:border-green-500'
                                        : 'border-[var(--border-divider)] focus:border-blue-500'
                            }`}
                        />
                        {websiteError && <p className="text-xs text-red-500 mt-1">{websiteError}</p>}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="contributor-name" className="text-sm font-semibold text-fill-color">
                            Name (added by) <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="contributor-name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Your name or username"
                            autoComplete="name"
                            className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="contributor-link" className="text-sm font-semibold text-fill-color">
                            Link <span className="text-fill-color/40 font-normal">(optional)</span>
                        </label>
                        <input
                            id="contributor-link"
                            type="url"
                            value={link}
                            onChange={(event) => setLink(event.target.value)}
                            placeholder="Your website, portfolio, or social link"
                            autoComplete="url"
                            className="w-full px-4 py-3 bg-[rgba(var(--fill-color-rgb),0.03)] border border-[var(--border-divider)] rounded-xl text-fill-color focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-start gap-5">
                        <div className="order-1 sm:order-2 flex-shrink-0 flex justify-center w-full sm:w-auto">
                            <Turnstile
                                ref={turnstileRef}
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                                onSuccess={setTurnstileToken}
                                onError={() => setTurnstileToken('')}
                                onExpire={() => setTurnstileToken('')}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!turnstileToken || isSubmitting}
                            className="order-2 sm:order-1 px-6 py-3 rounded-xl font-medium text-[15px] text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center cursor-pointer w-full sm:w-fit"
                        >
                            {isSubmitting ? <Spinner className="w-5 h-5 text-white" /> : 'Add Creator'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}