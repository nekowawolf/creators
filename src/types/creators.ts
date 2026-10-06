export interface AddedByInfo {
    name: string;
    url?: string;
}

export interface Creator {
    _id: string;
    name: string;
    description: string;
    image_url: string;
    website?: string;
    category: string;
    language: string;
    open_to_work: boolean;
    socials: {
        twitter?: string;
        instagram?: string;
        discord?: string;
        youtube?: string;
        telegram?: string;
        github?: string;
        tiktok?: string;
    };
    platforms: {
        fiverr?: string;
        upwork?: string;
        peopleperhour?: string;
        freelancer?: string;
    };
    added_by?: AddedByInfo;
    created_at?: string;
}

export interface CreatorSubmissionPayload {
    website: string;
    name: string;
    link: string;
    turnstile_token: string;
}
