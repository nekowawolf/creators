import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { creatorsMetadata } from '@/constants/metadataTemplates';
import AddCreatorClient from './AddCreatorClient';

export const metadata = creatorsMetadata('Add Creator', 'Submit a content creator to the Creators directory.');

export default function AddCreatorPage() {
    return (
        <>
            <Header />
            <AddCreatorClient />
            <Footer />
        </>
    );
}